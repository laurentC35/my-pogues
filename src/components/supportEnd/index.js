import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';

export const SupportEnd = ({ open, setOpen }) => {
  const close = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md">
      <DialogTitle>
        Fin de l'application
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
        <Typography>Le support de l'application a pris fin le 14/05/2024.</Typography>
        <Typography>
          Le service prendra fin le 1 juillet 2024, l'application ne sera donc plus disponible à
          partir de cette date.
        </Typography>
        <Typography>
          Vous êtes invités à utiliser Public-enemy pour personnaliser vos questionnaires.
        </Typography>
        <br />
        <Typography>Merci de votre compréhension.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};
