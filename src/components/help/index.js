import { Close, GitHub } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { AppContext } from 'MainApp';
import React, { useContext } from 'react';

export const Help = ({ open, setOpen }) => {
  const { ghUrl } = useContext(AppContext);
  const close = () => {
    setOpen(false);
  };

  const openGh = () => {
    window.open(
      ghUrl.startsWith('http')
        ? `${ghUrl}/issues`
        : 'https://github.com/laurentc35/my-pogues/issues',
      '_blank'
    );
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md">
      <DialogTitle>
        Aides, remarques ?
        <IconButton
          aria-label="close"
          onClick={close}
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
        <DialogContentText>{`Vous avez besoin d'aide, avez remarqué un bug ou vous voulez faire une suggestion pour améliorer l'application ?`}</DialogContentText>
        <DialogContentText>{`N'hesitez pas venir solliciter l'équipe en charge de cet outil.`}</DialogContentText>
        <br />
        <DialogContentText>
          {`Venez faire part de vos remarques directement sur GitHub.`}
        </DialogContentText>
        <br />
        <div className="center-button">
          <Button startIcon={<GitHub />} onClick={openGh} variant="contained">
            Aller sur GitHub
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};
