import { TextField } from '@mui/material';
import React, { useState } from 'react';

export const MainLogoForm = ({ mainLogo, save }) => {
  const [mainLogoForm, setMainLogoForm] = useState(mainLogo);

  const updateData = data => {
    setMainLogoForm(data);
    save(data);
  };

  const changeMainLogo = e => {
    updateData(e.target.value);
  };

  return (
    <>
      <TextField
        type={'url'}
        className="name-form"
        placeholder="https://..."
        margin="dense"
        label="Url du logo"
        fullWidth
        variant="standard"
        value={mainLogoForm || ''}
        onChange={changeMainLogo}
      />
      {mainLogoForm && (
        <div className="img-logo">
          <img src={mainLogoForm} alt="Logo de l'application..." />
        </div>
      )}
    </>
  );
};
