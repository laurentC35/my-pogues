import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';

export const FormId = ({ open, onClose, save }) => {
  const [id, setId] = useState('');
  const handleChange = e => setId(e.target.value);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un nouveau questionnaire</DialogTitle>
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
