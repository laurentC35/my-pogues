import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from 'App';
import { importSave } from 'utils/save';

export const ImportForm = ({ open, onClose }) => {
  const { setLoading, openNewNotif } = useContext(AppContext);

  const [savedData, setSavedData] = useState(null);
  const [error, setError] = useState(null);

  const reset = () => {
    setSavedData(null);
    setError(null);
  };

  const checkJson = json => {
    const { questionnaires, envs } = json;
    return !!questionnaires && !!envs;
  };

  useEffect(() => {
    reset();
  }, [open]);

  const readFile = event => {
    reset();
    const {
      target: { files },
    } = event;
    if (files.length > 0) {
      const save = files[0];
      const fileReader = new FileReader();
      fileReader.readAsText(save);
      fileReader.onload = () => {
        const text = fileReader.result;
        try {
          const result = JSON.parse(text);
          if (checkJson(result)) setSavedData(result);
          else setError('Le fichier de sauvegarde est incorrect');
        } catch (e) {
          setError('Erreur lors du chargement de la sauvegarde');
        }
      };
    }
  };

  const save = async () => {
    onClose();
    if (!error && savedData) {
      setLoading(true);
      try {
        await importSave(savedData);
        openNewNotif({ severity: 'success', message: 'Import terminé avec succès' });
      } catch (e) {
        openNewNotif({ severity: 'error', message: "Erreur lors de l'import de la sauvegarde" });
      }
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {'Importer une sauvegarde'}
        <IconButton
          aria-label="close"
          onClick={onClose}
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
        <DialogContentText>Veuillez choisir le fichier de sauvegarde</DialogContentText>
        <label>
          Fichier de sauvegarde (.json) :
          <input name="file" id="file" type="file" accept=".json" onChange={readFile} />
        </label>
        <DialogContentText color={'error'}>{error}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={!!error} onClick={save}>
          Importer la sauvegarde
        </Button>
      </DialogActions>
    </Dialog>
  );
};
