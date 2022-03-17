import { TextField } from '@mui/material';
import React, { useState } from 'react';

export const ValidationPageForm = ({ validationPage, save }) => {
  const [validationPageForm, setValidationPageForm] = useState(validationPage);

  const updateData = data => {
    setValidationPageForm(data);
    save(data);
  };

  const changeTitle = e => {
    updateData({ ...validationPageForm, title: e.target.value });
  };

  const changeBody = e => {
    updateData({ ...validationPageForm, body: e.target.value.split('\n\n') });
  };

  return (
    <>
      <TextField
        className="name-form"
        placeholder="Validation"
        margin="dense"
        label="Titre de la page de validation"
        fullWidth
        variant="filled"
        value={validationPageForm?.title || ''}
        onChange={changeTitle}
      />

      <TextField
        multiline
        minRows={3}
        maxRows={15}
        className="name-form"
        placeholder={`Vous êtes arrivés à la fin du questionnaire. Merci de cliquer sur le bouton "Envoyer" pour le transmettre ...`}
        margin="dense"
        label="Corps de la page de validation"
        fullWidth
        variant="outlined"
        value={validationPageForm?.body?.join('\n\n') || ''}
        onChange={changeBody}
      />
    </>
  );
};
