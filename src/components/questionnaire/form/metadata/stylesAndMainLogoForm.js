import { RemoveCircle } from '@mui/icons-material';
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import React, { useState } from 'react';

export const MainLogoForm = ({ mainLogo, style, save }) => {
  const [mainLogoForm, setMainLogoForm] = useState(mainLogo);
  const [styleForm, setStyleForm] = useState(style);

  const updateData = (data, type) => {
    if (type === 'logo') {
      setMainLogoForm(data);
      save({ mainLogo: data, style: styleForm });
    } else {
      setStyleForm(data);
      save({ mainLogo: mainLogoForm, style: data });
    }
  };

  const changeMainLogo = e => {
    updateData(e.target.value, 'logo');
  };

  const addStyleSheet = () => {
    const currentStyleSheets = styleForm?.styleSheets || [];
    if (
      currentStyleSheets.length === 0 ||
      currentStyleSheets[currentStyleSheets.length - 1] !== ''
    ) {
      const newStyleSheets = [...currentStyleSheets, ''];
      updateData({ styleSheets: newStyleSheets }, 'style');
    }
  };

  const changeStyleSheet = index => e => {
    const newStyleSheets = (styleForm?.styleSheets || []).map((s, i) =>
      i === index ? e.target.value : s
    );
    updateData({ styleSheets: newStyleSheets }, 'style');
  };

  const deleteStyleSheet = index => () => {
    const newStyleSheets = (styleForm?.styleSheets || []).filter((s, i) => i !== index);
    updateData({ styleSheets: newStyleSheets }, 'style');
  };

  return (
    <>
      {styleForm?.styleSheets?.map((sheet, i) => (
        <div key={`${i}-sheet`} className="container-css">
          <TextField
            type={'url'}
            className="form-css"
            placeholder="https://..."
            margin="dense"
            label="Url de la feuille de style (.css)"
            variant="standard"
            value={sheet || ''}
            onChange={changeStyleSheet(i)}
          />
          <Tooltip title="Supprimer cette feuille de style">
            <IconButton onClick={deleteStyleSheet(i)}>
              <RemoveCircle />
            </IconButton>
          </Tooltip>
        </div>
      ))}
      <br />

      <Button variant="contained" onClick={addStyleSheet}>
        Ajouter une feuille de style
      </Button>
      <br />
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
