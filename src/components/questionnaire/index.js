import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuestionnaire, useVisualizationList } from 'utils/hook/database';
import { ConfMenu } from 'components/questionnaires/ConfMenu';
import { useAPI } from 'utils/hook';
import { AppContext } from 'MainApp';
import { db } from 'utils/database/db';
import { AddCircle, ArrowBack, Delete, Edit, Preview } from '@mui/icons-material';
import { GenerationForm } from './form';
import { useNavigate } from 'react-router-dom';
import { JsonLunaticEditor } from './form/jsonLunatic';
import { EnoParams } from './enoParams';

export const Questionnaire = () => {
  const { id } = useParams();
  const { setLoading, openNewNotif } = useContext(AppContext);

  const navigate = useNavigate();

  const questionnaireFromDb = useQuestionnaire(id);

  const [visuEdit, setVisuEdit] = useState(null);
  const [questionnaireEdit, setQuestionnaireEdit] = useState(null);
  const [confEdit, setConfEdit] = useState(null);

  const addNewVisu = conf => {
    setConfEdit(conf);
    setVisuEdit(true);
  };

  const editQuestionnaire = id => async conf => {
    setConfEdit(conf);
    const { jsonLunatic } = await db.visualization.get(id);
    setQuestionnaireEdit({ id, json: jsonLunatic });
  };
  const closeForm = () => {
    setVisuEdit(null);
    setQuestionnaireEdit(null);
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

  const { title: questionnaireTitle, questionnaire } = questionnaireFromDb || {};

  const { visualizations } = useVisualizationList(id);

  const changeQuestionnaire = (id, questionnaireEdited) => async conf => {
    setLoading(true);
    const visu = await db.visualization.get(id);
    const { error } = await putLunaticQuestionnaire(conf, visu.idLunatic, questionnaireEdited);
    if (!error) {
      await db.visualization.put({ ...visu, jsonLunatic: questionnaireEdited });
      openNewNotif({
        severity: 'success',
        message: 'Le questionnaire a bien été modifié pour la visualisation.',
      });
    } else {
      openNewNotif({
        severity: 'error',
        message: 'Erreur lors de la modification du questionnaire.',
      });
    }
    setLoading(false);
  };

  const createNewVisu = (title, enoParams, metadata) => async conf => {
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
        const idLunatic = `${questId}-q-${visualizations.length}-${new Date().getTime()}`;
        const idMetadata = metadata
          ? `${questId}-m-${visualizations.length}-${new Date().getTime()}`
          : null;
        const jsonLunatic = { ...data, id: idLunatic };
        const { error: errorQuest } = await postLunaticQuestionnaire(conf, jsonLunatic);

        let errorMetadata = false;
        if (!errorQuest && metadata) {
          const newMetadata = { ...metadata, id: idMetadata };
          const { error: errorMet } = await postLunaticQuestionnaire(conf, newMetadata);
          errorMetadata = errorMet;
        }
        visuError = visuError || errorQuest || errorMetadata;
        if (!errorQuest && !errorMetadata)
          await db.visualization.put({
            questionnaireId: id,
            idLunatic,
            idMetadata,
            title,
            jsonLunatic,
            enoParams,
            metadata: metadata
              ? {
                  url: `${poguesBoUrl}/api/persistence/questionnaire/json-lunatic/${idMetadata}`,
                  value: metadata,
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
    ({ id, idLunatic, idMetadata }) =>
    async conf => {
      let error = false;
      const { error: qError } = await deleteLunaticQuestionnaire(conf, idLunatic);
      error = error || qError;
      if (!qError && idMetadata) {
        const { error: mError } = await deleteLunaticQuestionnaire(conf, idMetadata);
        error = error || mError;
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
    ({ enoParams, url, metadata }) =>
    conf => {
      const { stromaeUrl, queenUrl } = conf;
      const { mode } = enoParams;
      const baseUrl = mode === 'CAPI_CATI' ? `${queenUrl}/queen` : stromaeUrl;
      const questionnaireParam = `questionnaire=${encodeURIComponent(url)}`;
      const metadataParam = metadata?.url ? `&metadata=${encodeURIComponent(metadata?.url)}` : '';
      window.open(`${baseUrl}/visualize?${questionnaireParam}${metadataParam}`);
    };

  return (
    <>
      <div className="as-header">
        <div className="left">
          <Tooltip title={'Retour'}>
            <IconButton onClick={() => navigate(-1)} id="button-title">
              <ArrowBack />
            </IconButton>
          </Tooltip>
          {questionnaireFromDb && (
            <Typography variant="h4">{`Questionnaire : "${questionnaireTitle}"`}</Typography>
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

      {questionnaireFromDb && !(!visualizations || visualizations?.length === 0) && (
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
                const { title, url, id, idLunatic, idMetadata, enoParams, metadata } = v;
                return (
                  <TableRow key={url}>
                    <TableCell>{title}</TableCell>
                    <TableCell>
                      <EnoParams {...enoParams} />
                    </TableCell>
                    <TableCell>
                      <ConfMenu
                        action={visuOnStomae({ url, enoParams, metadata })}
                        icon={<Preview />}
                        title="Visualiser le questionnaire"
                      />
                      <ConfMenu
                        action={editQuestionnaire(id)}
                        icon={<Edit />}
                        title="Modifier manuellement le questionnaire"
                      />
                      <ConfMenu
                        action={deleteVisu({ id, idLunatic, idMetadata })}
                        icon={<Delete />}
                        title="Supprimer la visualisation"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <br />
      {questionnaireFromDb && <ConfMenu action={addNewVisu} title={'Ajouter une visualisation'} />}
      {visuEdit && <GenerationForm open onClose={closeForm} conf={confEdit} save={createNewVisu} />}
      {questionnaireEdit && (
        <JsonLunaticEditor
          open
          onClose={closeForm}
          conf={confEdit}
          save={changeQuestionnaire}
          id={questionnaireEdit.id}
          jsonLunatic={questionnaireEdit.json}
        />
      )}
    </>
  );
};
