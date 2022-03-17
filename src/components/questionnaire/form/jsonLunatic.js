import React, { useState } from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

export const JsonLunaticEditor = ({ open, onClose, save, id, jsonLunatic, conf }) => {
  const [jsonEdit, setJsonEdit] = useState(jsonLunatic);

  const handleChange = json => {
    setJsonEdit(json);
  };

  const localSave = () => {
    save(id, jsonEdit)(conf);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        Modification du questionnaire
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
        <Editor
          allowedModes={['text', 'tree', 'view', 'form', 'code']}
          value={jsonEdit}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={localSave}>Sauvegarder</Button>
      </DialogActions>
    </Dialog>
  );
};
