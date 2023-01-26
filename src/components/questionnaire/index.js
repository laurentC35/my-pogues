import {
  AddCircle,
  Archive,
  ArrowBack,
  Close,
  Delete,
  Preview,
  Update,
  Warning,
} from '@mui/icons-material';
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ConfMenu } from 'components/questionnaires/ConfMenu';
import { AppContext } from 'MainApp';
import React, { useCallback, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createZipAndDowload } from 'utils/api/dataDownload';
import { DELETED_STATE, OK_STATE, OUTDATED_STATE } from 'utils/constants';
import { db } from 'utils/database/db';
import { useAPI } from 'utils/hook';
import { useQuestionnaire, useVisualizationList } from 'utils/hook/database';
import { enoDateToJsDate } from 'utils/questionnaire';
import { EnoParams } from './enoParams';
import { GenerationForm } from './form';
import { MenuActions } from './menuActions';

export const TableRowStyled = styled(({ stateFromCloud, ...otherProps }) => (
  <TableRow {...otherProps} />
))(props => ({
  backgroundColor:
    props.stateFromCloud === OUTDATED_STATE
      ? props.theme.palette.warning.light
      : props.stateFromCloud === DELETED_STATE
      ? 'lightgray'
      : 'white',
}));

export const QuestionnaireContext = React.createContext();

export const Questionnaire = () => {
  const { id } = useParams();
  const { setLoading, openNewNotif } = useContext(AppContext);

  const navigate = useNavigate();

  const questionnaireFromDb = useQuestionnaire(id);

  const [visuEdit, setVisuEdit] = useState(null);
  const [confEdit, setConfEdit] = useState(null);

  const [warningOpen, setWarningOpen] = useState(true);

  const closeWarning = useCallback(() => setWarningOpen(false), []);

  const addNewVisu = conf => {
    setConfEdit(conf);
    setVisuEdit(true);
  };

  const closeForm = () => {
    setVisuEdit(null);
    setConfEdit(null);
  };

  const {
    getDDI,
    getLunaticQuestionnaireFromDDIFullOptions,
    getLunaticQuestionnaireFromDDISimple,
    postLunaticQuestionnaire,
    putLunaticQuestionnaire,
    deleteLunaticQuestionnaire,
  } = useAPI();

  const { title: questionnaireTitle, questionnaire, poguesDate } = questionnaireFromDb || {};

  const { visualizations } = useVisualizationList(id);

  const updateVisu = idVisu => async conf => {
    setLoading(true);
    let visuError = false;
    const visu = await db.visualization.get(idVisu);
    const { enoParams, idLunatic } = visu;
    const { context } = enoParams;
    const { blob: ddi } = await getDDI(conf, questionnaire);
    if (ddi) {
      const generation =
        context === 'DEFAULT'
          ? getLunaticQuestionnaireFromDDIFullOptions
          : getLunaticQuestionnaireFromDDISimple;
      const { data, error } = await generation(conf, ddi)(enoParams);
      visuError = visuError || error;
      if (!error && data) {
        const jsonLunatic = { ...data, id: idLunatic };
        const { error: errorQuest } = await putLunaticQuestionnaire(conf, idLunatic, jsonLunatic);
        visuError = visuError || errorQuest;
        if (!errorQuest)
          await db.visualization.put({
            ...visu,
            jsonLunatic,
          });
      }
    }
    if (visuError) {
      openNewNotif({
        severity: 'error',
        message: 'Une erreur est survenue lors de la mise à jour de la visualisation.',
      });
    } else {
      openNewNotif({
        severity: 'success',
        message: 'La visualisation a bien été mis à jour avec succés.',
      });
    }
    setLoading(false);
  };

  const createNewVisu = (title, enoParams, metadata, lunaticData) => async conf => {
    const { poguesBoUrl } = conf;
    const { context } = enoParams;
    let visuError = false;
    setLoading(true);
    const { blob: ddi } = await getDDI(conf, questionnaire);
    if (ddi) {
      const generation =
        context === 'DEFAULT'
          ? getLunaticQuestionnaireFromDDIFullOptions
          : getLunaticQuestionnaireFromDDISimple;
      const { data, error } = await generation(conf, ddi)(enoParams);
      visuError = visuError || error;
      if (!error && data) {
        const { id: questId } = data;
        const idLunatic = `${questId}q${visualizations.length}${new Date().getTime()}`;
        const idMetadata = metadata
          ? `${questId}m${visualizations.length}${new Date().getTime()}`
          : null;
        const idLunaticData = lunaticData
          ? `${questId}d${visualizations.length}${new Date().getTime()}`
          : null;
        const jsonLunatic = { ...data, id: idLunatic };
        const { error: errorQuest } = await postLunaticQuestionnaire(conf, jsonLunatic);
        visuError = visuError || errorQuest;

        if (!visuError && metadata) {
          const newMetadata = { ...metadata, id: idMetadata };
          const { error: errorMet } = await postLunaticQuestionnaire(conf, newMetadata);

          visuError = visuError || errorMet;
        }
        if (!visuError && lunaticData) {
          const newLunaticData = { ...lunaticData, id: idLunaticData };
          const { error: errorData } = await postLunaticQuestionnaire(conf, newLunaticData);
          visuError = visuError || errorData;
        }

        if (!visuError)
          await db.visualization.put({
            questionnaireId: id,
            idLunatic,
            idMetadata,
            idLunaticData,
            title,
            jsonLunatic,
            enoParams,
            metadata: metadata
              ? {
                  url: `${poguesBoUrl}/api/persistence/questionnaire/json-lunatic/${idMetadata}`,
                  value: metadata,
                }
              : null,
            lunaticData: lunaticData
              ? {
                  url: `${poguesBoUrl}/api/persistence/questionnaire/json-lunatic/${idLunaticData}`,
                  value: lunaticData,
                }
              : null,
            url: `${poguesBoUrl}/api/persistence/questionnaire/json-lunatic/${idLunatic}`,
          });
      }
    }
    if (visuError) {
      openNewNotif({
        severity: 'error',
        message: 'Une erreur est survenue lors de la création de la visualisation.',
      });
    } else {
      openNewNotif({
        severity: 'success',
        message: 'La visualisation a été créée avec succés. Vous pouvez dès à present la voir !',
      });
    }
    setLoading(false);
  };

  const deleteVisu =
    ({ id, idLunatic, idMetadata, idLunaticData }) =>
    async conf => {
      let error = false;
      const { error: qError } = await deleteLunaticQuestionnaire(conf, idLunatic);
      error = error || qError;
      if (!error && idMetadata) {
        const { error: mError } = await deleteLunaticQuestionnaire(conf, idMetadata);
        error = error || mError;
      }
      if (!error && idLunaticData) {
        const { error: dError } = await deleteLunaticQuestionnaire(conf, idLunaticData);
        error = error || dError;
      }
      if (error) {
        openNewNotif({
          severity: 'warning',
          message: 'Erreur lors de la suppression de la visualisation dans le cloud.',
        });
      } else {
        await db.visualization.delete(id);
        openNewNotif({ severity: 'success', message: 'La visualisation a bien été supprimée.' });
      }
    };

  const visuOnStomae =
    ({ enoParams, url, metadata, lunaticData }) =>
    conf => {
      const { stromaeUrl, queenUrl } = conf;
      const { mode } = enoParams;
      const baseUrl = mode === 'CAPI_CATI' ? `${queenUrl}/queen` : stromaeUrl;
      const questionnaireParam = `questionnaire=${encodeURIComponent(url)}`;
      const metadataParam = metadata?.url ? `&metadata=${encodeURIComponent(metadata?.url)}` : '';
      const lunaticDataParam = lunaticData?.url
        ? `&data=${encodeURIComponent(lunaticData?.url)}`
        : '';
      window.open(`${baseUrl}/visualize?${questionnaireParam}${metadataParam}${lunaticDataParam}`);
    };

  const downloadPackage = visu => async () => {
    setLoading(true);
    const { title, jsonLunatic, metadata, lunaticData } = visu;
    const finalData = [];
    if (jsonLunatic) finalData.push({ data: jsonLunatic, fileName: 'json-lunatic' });
    if (metadata) finalData.push({ data: metadata.value, fileName: 'json-metadata' });
    if (lunaticData) finalData.push({ data: lunaticData.value, fileName: 'json-data' });
    await createZipAndDowload(finalData, title);
    setLoading(false);
  };

  return (
    <QuestionnaireContext.Provider value={{ questionnaireTitle, questionnaire }}>
      <div className="as-header">
        <div className="left">
          <Tooltip title={'Retour'}>
            <IconButton onClick={() => navigate(-1)} id="button-title">
              <ArrowBack />
            </IconButton>
          </Tooltip>
          {questionnaireFromDb && (
            <>
              <Typography variant="h4">{`Questionnaire : "${questionnaireTitle}"`}</Typography>
              <br />
              <MenuActions questionnaireId={id} />
            </>
          )}
          {!questionnaireFromDb && <h3>{`Questionnaire ${id} introuvable`}</h3>}
        </div>

        <div className="right">
          {questionnaireFromDb && (
            <ConfMenu
              action={addNewVisu}
              icon={<AddCircle />}
              title={'Ajouter une visualisation'}
            />
          )}
        </div>
      </div>

      <Dialog open={warningOpen} onClose={closeWarning} maxWidth="md" fullWidth>
        <DialogTitle>
          Attention : fonctionnalité expérimentale
          <IconButton
            aria-label="close"
            onClick={closeWarning}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning">{`ATTENTION : cette fonctionnalité est expérimentale et représente l'avant-première d'une fonctionnalité disponible prochainement dans l'atelier de conception.`}</Alert>
        </DialogContent>
      </Dialog>

      {questionnaireFromDb && (!visualizations || visualizations?.length === 0) && (
        <Typography>Pas de visualisation</Typography>
      )}
      {visualizations?.length > 0 && (
        <TableContainer component={Paper} className={'save-list'}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Paramètres</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visualizations.map(v => {
                const {
                  title,
                  url,
                  id: idVisu,
                  idLunatic,
                  idMetadata,
                  idLunaticData,
                  enoParams,
                  metadata,
                  lunaticData,
                  jsonLunatic: { generatingDate },
                } = v;

                const outDated = new Date(poguesDate) > enoDateToJsDate(generatingDate);
                return (
                  <TableRowStyled key={url} stateFromCloud={outDated ? OUTDATED_STATE : OK_STATE}>
                    <TableCell>
                      {outDated && (
                        <>
                          <Tooltip title={'Visualisation dépassée, pensez à la mettre à jour.'}>
                            <Warning />
                          </Tooltip>
                          <br />
                        </>
                      )}
                      {title}
                    </TableCell>
                    <TableCell>
                      <EnoParams {...enoParams} />
                    </TableCell>
                    <TableCell>
                      {outDated && (
                        <ConfMenu
                          action={updateVisu(idVisu)}
                          icon={<Update />}
                          title="Mettre à jour la visualisation"
                        />
                      )}
                      <ConfMenu
                        action={visuOnStomae({ url, enoParams, metadata, lunaticData })}
                        icon={<Preview />}
                        title="Visualiser le questionnaire"
                      />

                      <ConfMenu
                        action={deleteVisu({ id: idVisu, idLunatic, idMetadata, idLunaticData })}
                        icon={<Delete />}
                        title="Supprimer la visualisation"
                      />
                      <Tooltip title={'Télécharger les fichiers de cette visualisation.'}>
                        <IconButton onClick={downloadPackage(v)} aria-haspopup="true">
                          {<Archive />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRowStyled>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <br />
      {questionnaireFromDb && <ConfMenu action={addNewVisu} title={'Ajouter une visualisation'} />}
      {visuEdit && <GenerationForm open onClose={closeForm} conf={confEdit} save={createNewVisu} />}
    </QuestionnaireContext.Provider>
  );
};
