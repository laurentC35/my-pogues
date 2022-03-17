import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { AppContext } from 'MainApp';
import React, { useContext, useEffect, useState } from 'react';

export const ConfigurationForm = ({ create, open, onClose, environnement = {}, saveEnv }) => {
  const {
    env: { environnements },
  } = useContext(AppContext);
  const { id, name, conf } = environnement;

  const [formName, setFormName] = useState(name);
  const [formConfiguration, setFormConfiguration] = useState(conf);

  const [error, setError] = useState(null);

  const handleChangeItemConf = itemKey => e => {
    const newConf = { ...formConfiguration, [itemKey]: e.target.value };
    setFormConfiguration(newConf);
  };

  const handleChangeName = e => {
    setFormName(e.target.value);
  };

  const save = e => {
    e.preventDefault();
    const envToSave = { id, name: formName, conf: formConfiguration };
    saveEnv(envToSave);
    onClose();
  };

  useEffect(() => {
    if (formName.length === 0) setError('Le nom ne peut être vide');
    else if (
      environnements
        .filter(({ id: idEnv }) => id !== idEnv)
        .map(({ name }) => name)
        .includes(formName)
    )
      setError('Le nom existe déjà');
    else setError(null);
  }, [id, environnements, formName]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {create
          ? `Créer la configuration "${formName}"`
          : `Modifier la configuration "${formName}"`}
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
      <form onSubmit={save}>
        <DialogContent>
          {name && (
            <TextField
              className="name-form"
              error={!!error}
              required
              helperText={error ? error : ''}
              placeholder="Nouvelle configuration"
              key={id}
              margin="dense"
              label="Nom de la configuration"
              fullWidth
              variant="standard"
              value={formName}
              onChange={handleChangeName}
            />
          )}
          {formConfiguration &&
            Object.keys(formConfiguration).map(itemKey => {
              return (
                <TextField
                  key={itemKey}
                  margin="dense"
                  label={itemKey}
                  fullWidth
                  variant="standard"
                  value={formConfiguration[itemKey]}
                  onChange={handleChangeItemConf(itemKey)}
                />
              );
            })}
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={!!error}>
            Sauvegarder
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
