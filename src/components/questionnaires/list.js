import {
  Backup,
  Delete,
  FileUpload,
  ScreenSearchDesktop,
  Update,
  Visibility,
} from '@mui/icons-material';
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
import { TableRowStyled } from 'components/questionnaire';
import { format } from 'date-fns';
import { AppContext } from 'MainApp';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DELETED_STATE, OFFLINE_STATE, OK_STATE, OUTDATED_STATE } from 'utils/constants';
import { db } from 'utils/database/db';
import { useActions, useAPI } from 'utils/hook';
import { useQuestionnaireList } from 'utils/hook/database';
import { questionnaireToSavedObject } from 'utils/questionnaire';
import { ConfMenu } from './ConfMenu';
import { StatusIcon } from './statusIcon';

export const QuestionnaireList = () => {
  const {
    setLoading,
    openNewNotif,
    env: { environnements },
  } = useContext(AppContext);
  const {
    createQuestionnaire,
    deleteQuestionnaire,
    openPogues,
    updateQuestionnaireFromLocal,
    updateQuestionnaireFromPogues,
  } = useActions();

  const [checkUpdates, setCheckUpdates] = useState(false);
  const [atLeastOneUpdate, setAtLeastOneUpdate] = useState(false);

  const setSuccessMessage = useCallback(
    newMessage => {
      openNewNotif({ severity: 'success', message: newMessage });
    },
    [openNewNotif]
  );

  const setErrorMessage = useCallback(
    newMessage => {
      openNewNotif({ severity: 'error', message: newMessage });
    },
    [openNewNotif]
  );

  const { questionnaires } = useQuestionnaireList();
  const { getQuestionnaire, initPogues } = useAPI();

  const allUpdateFromPogues = async () => {
    setLoading(true);
    try {
      await (questionnaires || []).reduce(async (previousPromise, q) => {
        await previousPromise;
        const update = async () => {
          const { id, conf } = q;
          const { data } = await getQuestionnaire(conf, id);
          if (data) {
            await db.questionnaire.put(questionnaireToSavedObject(data, conf));
          } else throw new Error('Erreur lors de la sauvegarde');
        };

        return update();
      }, Promise.resolve({}));
      setSuccessMessage('Tous les questionnaires ont été mis à jour');
    } catch (e) {
      setErrorMessage("Certains questionnaires n'ont pas été mis à jour");
    }

    setLoading(false);
  };

  useEffect(() => {
    const toUpdate = async () => {
      try {
        let toUpdate = false;
        await (questionnaires || []).reduce(async (previousPromise, questionnaire) => {
          await previousPromise;
          const update = async () => {
            const { id, poguesDate: oldPoguesDate, conf } = questionnaire;
            if (conf) {
              const { status } = await initPogues(conf);
              const poguesAlive = status === 200;
              const { data, error } = await getQuestionnaire(conf, id);
              if (data) {
                const { poguesDate: newPoguesDate } = questionnaireToSavedObject(data);
                if (new Date(newPoguesDate) > new Date(oldPoguesDate)) {
                  await db.questionnaire.put({
                    ...questionnaire,
                    newPoguesDate,
                    stateFromCloud: OUTDATED_STATE,
                  });
                  toUpdate = true;
                } else
                  await db.questionnaire.put({
                    ...questionnaire,
                    stateFromCloud: OK_STATE,
                  });
              } else {
                if (error) {
                  await db.questionnaire.put({
                    ...questionnaire,
                    stateFromCloud: poguesAlive ? DELETED_STATE : OFFLINE_STATE,
                  });
                }
              }
            } else
              await db.questionnaire.put({
                ...questionnaire,
                stateFromCloud: OFFLINE_STATE,
              });
          };

          return update();
        }, Promise.resolve({}));
        setAtLeastOneUpdate(toUpdate);
      } catch (e) {
        console.error(e);
        setErrorMessage('Problème de connexion avec Pogues !');
      }
      setCheckUpdates(true);
    };
    if (questionnaires?.length > 0 && !checkUpdates) toUpdate();
  }, [
    questionnaires,
    checkUpdates,
    setSuccessMessage,
    getQuestionnaire,
    setErrorMessage,
    environnements,
    initPogues,
    setLoading,
  ]);

  return (
    <>
      {questionnaires?.length > 0 && (
        <>
          <ConfMenu
            action={allUpdateFromPogues}
            title="Tout mettre à jour"
            from
            startIcon={<Update />}
            disabled={!atLeastOneUpdate}
          />

          <TableContainer component={Paper} className={'save-list'}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Titre</TableCell>
                  <TableCell>Date du questionnaire dans Pogues</TableCell>
                  <TableCell>Dernière sauvegarde en locale</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questionnaires.map(q => {
                  const { id, title, poguesDate, newPoguesDate, saveDate, stateFromCloud, conf } =
                    q;
                  return (
                    <TableRowStyled key={id} stateFromCloud={stateFromCloud}>
                      <TableCell>
                        {stateFromCloud && stateFromCloud !== OK_STATE && (
                          <>
                            <StatusIcon status={stateFromCloud} />
                            <br />
                          </>
                        )}
                        {id}
                      </TableCell>
                      <TableCell>{title}</TableCell>
                      <TableCell>
                        {newPoguesDate && <b>Version actuelle : </b>}
                        {format(new Date(poguesDate), 'dd/MM/yyyy à HH:mm:ss')}
                        {newPoguesDate && (
                          <>
                            <br />
                            <i>
                              <b>Nouvelle version : </b>
                              {format(new Date(newPoguesDate), 'dd/MM/yyyy à HH:mm:ss')}
                            </i>
                          </>
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(saveDate), 'dd/MM/yyyy à HH:mm:ss')}</TableCell>
                      <TableCell>
                        <ConfMenu
                          action={openPogues(id)}
                          icon={<Visibility />}
                          title="Ouvrir le questionnaire dans Pogues"
                        />
                        <Tooltip title="Voir mes visualisations">
                          <Link to={`/questionnaire/${id}/visualisations`}>
                            <IconButton>
                              <ScreenSearchDesktop />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        {stateFromCloud === OUTDATED_STATE && (
                          <Tooltip title="Mettre à jour la sauvegarde">
                            <IconButton onClick={() => updateQuestionnaireFromPogues(id)(conf)}>
                              <Update />
                            </IconButton>
                          </Tooltip>
                        )}

                        <ConfMenu
                          action={conf => {
                            updateQuestionnaireFromLocal(id)(conf);
                            setCheckUpdates(false);
                          }}
                          icon={<Backup />}
                          title="Remplacer la version de Pogues par celle-ci"
                        />
                        <ConfMenu
                          action={conf => {
                            createQuestionnaire(id)(conf);
                            setCheckUpdates(false);
                          }}
                          icon={<FileUpload />}
                          title="Créer le questionnaire dans Pogues"
                        />

                        <Tooltip title="Supprimer la sauvegarde">
                          <IconButton onClick={() => deleteQuestionnaire(id)()}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRowStyled>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {!questionnaires ||
        (questionnaires?.length === 0 && (
          <Typography className={'no-data'}>Pas de questionnaire sauvegardé</Typography>
        ))}
    </>
  );
};
