import { TextField } from '@mui/material';
import React, { useState } from 'react';

export const WelcomePageForm = ({ welcomePage, save }) => {
  const [welcomePageForm, setWelcomePageForm] = useState(welcomePage);

  const updateData = data => {
    setWelcomePageForm(data);
    save(data);
  };

  const changeTitle = e => {
    updateData({ ...welcomePageForm, title: e.target.value });
  };

  const changeBody = e => {
    updateData({ ...welcomePageForm, body: { value: e.target.value.split('\n\n') } });
  };

  const changeLegalTermsTitle = e => {
    updateData({ ...welcomePageForm, legalTermsTitle: e.target.value });
  };

  const changeLegalTermsDetails = e => {
    updateData({
      ...welcomePageForm,
      legalTermsDetails: { value: e.target.value.split('\n\n') },
    });
  };

  return (
    <>
      <TextField
        className="name-form"
        placeholder="Bienvenue !"
        margin="dense"
        label="Titre de la page d'accueil"
        fullWidth
        variant="filled"
        value={welcomePageForm?.title || ''}
        onChange={changeTitle}
      />

      <TextField
        multiline
        minRows={3}
        maxRows={15}
        className="name-form"
        placeholder="Bienvenue sur le questionnaire ...."
        margin="dense"
        label="Corps de la page d'accueil"
        fullWidth
        variant="outlined"
        value={welcomePageForm?.body?.value.join('\n\n') || ''}
        onChange={changeBody}
      />

      <br />
      <br />

      <TextField
        className="name-form"
        placeholder="Cadre légal de l'enquête"
        margin="dense"
        label="Titre du cadre légal de l'enquête"
        fullWidth
        variant="filled"
        value={welcomePageForm?.legalTermsTitle || ''}
        onChange={changeLegalTermsTitle}
      />

      <TextField
        multiline
        minRows={3}
        maxRows={15}
        className="name-form"
        placeholder="Blabla...."
        margin="dense"
        label="Corps du cadre légal"
        fullWidth
        variant="outlined"
        value={welcomePageForm?.legalTermsDetails?.value.join('\n\n') || ''}
        onChange={changeLegalTermsDetails}
      />
    </>
  );
};
