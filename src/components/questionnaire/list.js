import {
  Backup,
  CloudDownload,
  Delete,
  Download,
  FileUpload,
  Visibility,
} from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
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
import { format } from 'date-fns';
import { db } from 'utils/database/db';
import { useAPI } from 'utils/hook';
import { useQuestionnaireList } from 'utils/hook/database';
import { questionnaireToSavedObject } from 'utils/questionnaire';
import { downloadDataAsJson } from 'utils/api/dataDownload';
import { AppContext } from 'App';
import { ItemMenu } from './itemMenu';

export const QuestionnaireList = () => {
  const { setLoading, openNewNotif } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  const setSuccessMessage = newMessage => {
    openNewNotif({ severity: 'success', message: newMessage });
  };

  const setErrorMessage = newMessage => {
    openNewNotif({ severity: 'error', message: newMessage });
  };

  const { questionnaires } = useQuestionnaireList();
  const { getQuestionnaire, putQuestionnaire, postQuestionnaire, deleteQuestionnaire } = useAPI();

  const deleteItem =
    (id, deletePogues = false) =>
    async conf => {
      setLoading(true);
      let success = false;
      try {
        if (deletePogues) {
          const { status } = await deleteQuestionnaire(conf, id);
          if (status === 204) {
            await db.questionnaire.delete(id);
            success = true;
          }
        } else {
          await db.questionnaire.delete(id);
          success = true;
        }
      } catch (e) {}
      if (success) setSuccessMessage('Suppression bien effectuée');
      else setErrorMessage('Erreur lors de la suppression');
      setLoading(false);
    };

  const downloadQuestionnaire = async id => {
    try {
      const { questionnaire } = await db.questionnaire.get(id);
      if (questionnaire) {
        downloadDataAsJson(questionnaire, `${id}`);
      }
    } catch (e) {}
  };

  const updateItemFromPogues = id => async conf => {
    setLoading(true);
    let success = false;
    try {
      const { data } = await getQuestionnaire(conf, id);
      if (data) {
        await db.questionnaire.put(questionnaireToSavedObject(data));
        success = true;
      }
    } catch (e) {}
    if (success) setSuccessMessage('Mise à jour effectuée');
    else setErrorMessage('Erreur lors de la mise à jour');
    setLoading(false);
  };

  const createQuestionnaire = id => async conf => {
    setLoading(true);
    let success = false;
    try {
      const { questionnaire } = await db.questionnaire.get(id);
      if (questionnaire) {
        const { status } = await postQuestionnaire(conf, questionnaire);
        if (status === 201) success = true;
      }
    } catch (e) {}
    if (success) setSuccessMessage('Le questionnaire a bien été créé dans Pogues');
    else setErrorMessage('Erreur lors de la création du questionnaire dans Pogues');
    setLoading(false);
  };

  const updateItemFromLocal = id => async conf => {
    setLoading(true);
    let success = false;
    try {
      const { questionnaire } = await db.questionnaire.get(id);
      if (questionnaire) {
        const { status } = await putQuestionnaire(conf, id, questionnaire);
        if (status === 204) success = true;
      }
    } catch (e) {}
    if (success) setSuccessMessage('Mise à jour effectuée');
    else setErrorMessage('Erreur lors de la mise à jour');
    setLoading(false);
  };

  const openPogues = id => conf => {
    const { poguesUrl } = conf;
    window.open(`${poguesUrl}/questionnaire/${id}`, '_blank');
  };

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

  const allDelete = async (e, deletePogues = false) => {
    setLoading(true);
    try {
      await (questionnaires || []).reduce(async (previousPromise, q) => {
        await previousPromise;
        const update = async () => {
          const { id } = q;
          let success = false;
          if (deletePogues) {
            const { status } = await deleteQuestionnaire(id);
            if (status === 204) {
              await db.questionnaire.delete(id);
              success = true;
            }
          } else {
            await db.questionnaire.delete(id);
            success = true;
          }
          if (!success) throw new Error("Erreur lors d'une suppression");
        };

        return update();
      }, Promise.resolve({}));
      setSuccessMessage('Tous les questionnaires ont été supprimés');
    } catch (e) {
      setErrorMessage("Certains questionnaires n'ont pas été supprimés");
    }

    setLoading(false);
  };

  return (
    <>
      {questionnaires?.length > 0 && (
        <>
          <ItemMenu action={allUpdateFromPogues} title="Tout mettre à jour" from />

          <Button onClick={() => setOpen(true)}>Tout supprimer</Button>
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
                        <ItemMenu
                          action={openPogues(id)}
                          icon={<Visibility />}
                          title="Ouvrir le questionnaire dans Pogues"
                        />
                        <ItemMenu
                          from
                          action={updateItemFromPogues(id)}
                          icon={<CloudDownload />}
                          title="Mettre à jour la sauvegarde"
                        />
                        <ItemMenu
                          action={updateItemFromLocal(id)}
                          icon={<Backup />}
                          title="Remplacer la version de Pogues par celle-ci"
                        />
                        <Tooltip title="Télécharger le questionnaire">
                          <IconButton onClick={() => downloadQuestionnaire(id)}>
                            <Download />
                          </IconButton>
                        </Tooltip>
                        <ItemMenu
                          action={createQuestionnaire(id)}
                          icon={<FileUpload />}
                          title="Créer le questionnaire dans Pogues"
                        />
                        <Tooltip title="Supprimer la sauvegarde">
                          <IconButton onClick={() => deleteItem(id)()}>
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
          <Dialog open={open} onClose={onClose}>
            <DialogTitle>{'Êtes-vous sûr de vouloir tout supprimer ?'}</DialogTitle>

            <DialogActions>
              <Button onClick={onClose}>Non</Button>
              <Button onClick={allDelete}>Oui</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {!questionnaires ||
        (questionnaires?.length === 0 && (
          <Typography className={'no-data'}>Pas de questionnaire sauvegardé</Typography>
        ))}
    </>
  );
};
