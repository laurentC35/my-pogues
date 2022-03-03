import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';

export const FormId = ({ open, onClose, save }) => {
  const [id, setId] = useState('');
  const handleChange = e => setId(e.target.value);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {'Ajouter un nouveau questionnaire'}
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
        <DialogContentText>Veuillez précisez l'identifiant du questionnaire</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Identifiant"
          fullWidth
          variant="standard"
          value={id}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => save(id)}>Ajouter</Button>
      </DialogActions>
    </Dialog>
  );
};
