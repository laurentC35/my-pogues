import { TextField } from '@mui/material';
import React, { useState } from 'react';

export const EndPageForm = ({ endPage, save }) => {
  const [endPageForm, setEndPageForm] = useState(endPage);

  const updateData = data => {
    setEndPageForm(data);
    save(data);
  };

  const changeTitle = e => {
    updateData({ ...endPageForm, title: e.target.value });
  };

  const changeBody = e => {
    updateData({ ...endPageForm, body: e.target.value.split('\n\n') });
  };

  const changePdfMessage = e => {
    updateData({ ...endPageForm, pdfMessage: e.target.value });
  };

  const changeYouCanQuit = e => {
    updateData({ ...endPageForm, youCanQuit: e.target.value });
  };

  return (
    <>
      <TextField
        className="name-form"
        placeholder="Fin"
        margin="dense"
        label="Titre de la page de fin"
        fullWidth
        variant="filled"
        value={endPageForm?.title || ''}
        onChange={changeTitle}
      />

      <TextField
        multiline
        minRows={3}
        maxRows={15}
        className="name-form"
        placeholder="Votre questionnaire a bien été expédié. Merci de votre collabaration..."
        margin="dense"
        label="Corps de la page de fin"
        fullWidth
        variant="outlined"
        value={endPageForm?.body?.join('\n\n') || ''}
        onChange={changeBody}
      />
      <br />
      <TextField
        className="name-form"
        placeholder="Télécharger la preuve de dépôt"
        margin="dense"
        label="Message pour la preuve de dépôt"
        fullWidth
        variant="filled"
        value={endPageForm?.pdfMessage || ''}
        onChange={changePdfMessage}
      />
      <br />
      <TextField
        className="name-form"
        placeholder="Vous pouvez à présent vous déconnecter...."
        margin="dense"
        label="Message invitant à quitter le questionnaire"
        fullWidth
        variant="filled"
        value={endPageForm?.youCanQuit || ''}
        onChange={changeYouCanQuit}
      />
    </>
  );
};
