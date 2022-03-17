import { TextField } from '@mui/material';
import React from 'react';

export const initialFormData = {
  mode: 'CAWI', // 'CAWI' / 'CAPI_CATI' / 'ALL'
  pagination: 'NONE', // 'NONE' / 'SEQUENCE' / 'SUBSEQUENCE' / 'QUESTION'
  questNum: 'ALL', // 'ALL' / 'MODULE' /  'NO_NUMBER'
  seqNum: true, // true / false
  context: 'DEFAULT', // 'DEFAULT' / 'HOUSEHOLD' / 'BUSINESS'
};

export const TitleForm = ({ title, setTitle }) => {
  const changeTitle = e => {
    setTitle(e.target.value);
  };

  return (
    <TextField
      className="name-form"
      required
      placeholder="Nouvelle visualisation"
      margin="dense"
      label="Nom de la visualisation"
      fullWidth
      variant="standard"
      value={title}
      onChange={changeTitle}
    />
  );
};
