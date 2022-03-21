import {
  Backup,
  CloudDownload,
  Delete,
  Download,
  FileUpload,
  ScreenSearchDesktop,
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
import React, { useContext } from 'react';
import { format } from 'date-fns';
import { db } from 'utils/database/db';
import { useAPI, useActions } from 'utils/hook';
import { useQuestionnaireList } from 'utils/hook/database';
import { questionnaireToSavedObject } from 'utils/questionnaire';
import { AppContext } from 'MainApp';
import { ConfMenu } from './ConfMenu';
import { Link } from 'react-router-dom';

export const QuestionnaireList = () => {
  const { setLoading, openNewNotif } = useContext(AppContext);
  const {
    createQuestionnaire,
    deleteQuestionnaire,
    downloadQuestionnaire,
    openPogues,
    updateQuestionnaireFromLocal,
    updateQuestionnaireFromPogues,
  } = useActions();

  const setSuccessMessage = newMessage => {
    openNewNotif({ severity: 'success', message: newMessage });
  };

  const setErrorMessage = newMessage => {
    openNewNotif({ severity: 'error', message: newMessage });
  };

  const { questionnaires } = useQuestionnaireList();
  const { getQuestionnaire } = useAPI();

  const allUpdateFromPogues = async conf => {
    setLoading(true);
    try {
      await (questionnaires || []).reduce(async (previousPromise, q) => {
        await previousPromise;
        const update = async () => {
          const { id } = q;
          const { data } = await getQuestionnaire(conf, id);
          if (data) {
            await db.questionnaire.put(questionnaireToSavedObject(data));
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

  return (
    <>
      {questionnaires?.length > 0 && (
        <>
          <ConfMenu action={allUpdateFromPogues} title="Tout mettre à jour" from />

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
                  const { id, title, poguesDate, saveDate } = q;
                  return (
                    <TableRow key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{title}</TableCell>
                      <TableCell>{format(new Date(poguesDate), 'dd/MM/yyyy à HH:mm:ss')}</TableCell>
                      <TableCell>{format(new Date(saveDate), 'dd/MM/yyyy à HH:mm:ss')}</TableCell>
                      <TableCell>
                        <ConfMenu
                          action={openPogues(id)}
                          icon={<Visibility />}
                          title="Ouvrir le questionnaire dans Pogues"
                        />
                        <ConfMenu
                          from
                          action={updateQuestionnaireFromPogues(id)}
                          icon={<CloudDownload />}
                          title="Mettre à jour la sauvegarde"
                        />
                        <ConfMenu
                          action={updateQuestionnaireFromLocal(id)}
                          icon={<Backup />}
                          title="Remplacer la version de Pogues par celle-ci"
                        />
                        <Tooltip title="Télécharger le questionnaire">
                          <IconButton onClick={() => downloadQuestionnaire(id)}>
                            <Download />
                          </IconButton>
                        </Tooltip>
                        <ConfMenu
                          action={createQuestionnaire(id)}
                          icon={<FileUpload />}
                          title="Créer le questionnaire dans Pogues"
                        />
                        <Tooltip title="Voir mes visualisations">
                          <Link to={`/questionnaire/${id}/visualisations`}>
                            <IconButton>
                              <ScreenSearchDesktop />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        <Tooltip title="Supprimer la sauvegarde">
                          <IconButton onClick={() => deleteQuestionnaire(id)()}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
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
