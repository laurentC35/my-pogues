import { Close, Delete, Edit } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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
} from '@mui/material';
import { AppContext } from 'App';
import React, { useContext, useState } from 'react';
import { ConfigurationForm } from '.';

export const EnvForm = ({ open, onClose }) => {
  const {
    env: { environnements, saveEnvironnement, deleteEnvironnement, reset },
  } = useContext(AppContext);

  const defaultConf = Object.keys(environnements[0].conf).reduce((acc, k) => {
    return { ...acc, [k]: '' };
  }, {});

  const [environnementEdit, setEnvironnementEdit] = useState(null);
  const [create, setCreate] = useState(false);

  const openForm = idToOpen => {
    const env = environnements?.find(({ id }) => id === idToOpen);
    setEnvironnementEdit(env);
  };

  const closeForm = () => {
    setCreate(false);
    setEnvironnementEdit(null);
  };

  const openFormForNewEnv = () => {
    setCreate(true);
    setEnvironnementEdit({ name: 'Nouvelle Configuration', conf: defaultConf });
  };

  const canDelete = environnements?.length > 1;

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {'Modifier les environnements'}
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
        <DialogContent className="env-dialog">
          <TableContainer component={Paper} className={'save-list'}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {environnements?.map(({ id, name }) => {
                  return (
                    <TableRow key={id}>
                      <TableCell>{name}</TableCell>
                      <TableCell>
                        <Tooltip title="Modifier la configuration">
                          <IconButton onClick={() => openForm(id)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        {canDelete && (
                          <Tooltip title="Supprimer la configuration">
                            <IconButton onClick={() => deleteEnvironnement(id)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={reset}>Réinitialiser</Button>
          <Button onClick={openFormForNewEnv}>Ajouter un environnement</Button>
        </DialogActions>
      </Dialog>
      {environnementEdit && (
        <ConfigurationForm
          open
          create={create}
          onClose={closeForm}
          environnement={environnementEdit}
          saveEnv={saveEnvironnement}
        />
      )}
    </>
  );
};
