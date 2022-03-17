import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

export const modeOptions = [
  { value: 'CAWI', label: 'CAWI' },
  { value: 'CAPI_CATI', label: 'CAPI / CATI' },
  { value: 'ALL', label: 'ALL' },
];
export const paginationOptions = [
  // { value: 'NONE', label: 'Aucune' },
  { value: 'SEQUENCE', label: 'Une page par séquence' },
  { value: 'SUBSEQUENCE', label: 'Une page par sous-séquence' },
  { value: 'QUESTION', label: 'Une page par question' },
];
export const questNumOptions = [
  { value: 'ALL', label: 'Homogène sur tout le questionnaire' },
  { value: 'MODULE', label: 'Par séquénce' },
  { value: 'NO_NUMBER', label: 'Aucune numérotation' },
];
export const seqNumOptions = [
  { value: true, label: 'Oui' },
  { value: false, label: 'Non' },
];
export const contextOptions = [
  { value: 'DEFAULT', label: 'Sans context' },
  { value: 'HOUSEHOLD', label: 'Ménage' },
  { value: 'BUSINESS', label: 'Entreprise' },
];

export const EnoParamsForm = ({ enoParams, setEnoParms }) => {
  const handleChange = e => {
    const { name, value } = e.target;
    setEnoParms({ ...enoParams, [name]: value });
  };

  return (
    <>
      <FormControl fullWidth className="form-element">
        <InputLabel id="context">Contexte</InputLabel>
        <Select
          labelId="context"
          id="context-simple-select"
          value={enoParams.context}
          label="Contexte"
          name="context"
          onChange={handleChange}
        >
          {contextOptions.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth className="form-element">
        <InputLabel id="mode">Mode</InputLabel>
        <Select
          labelId="mode"
          id="mode-simple-select"
          value={enoParams.mode}
          label="Mode"
          name="mode"
          onChange={handleChange}
        >
          {modeOptions.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {enoParams.context === 'DEFAULT' && (
        <>
          {enoParams.mode === 'CAWI' && (
            <FormControl fullWidth className="form-element">
              <InputLabel id="pagination">Pagination</InputLabel>
              <Select
                labelId="pagination"
                id="pagination-simple-select"
                value={enoParams.pagination}
                label="Pagination"
                name="pagination"
                onChange={handleChange}
              >
                {paginationOptions.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl fullWidth className="form-element">
            <InputLabel id="seqNum">Numérotation des séquences</InputLabel>
            <Select
              labelId="seqNum"
              id="seqNum-simple-select"
              value={enoParams.seqNum}
              label="Numérotation"
              name="seqNum"
              onChange={handleChange}
            >
              {seqNumOptions.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className="form-element">
            <InputLabel id="questNum">Numérotation des questions</InputLabel>
            <Select
              labelId="questNum"
              id="questNum-simple-select"
              value={enoParams.questNum}
              label="Numérotation"
              name="questNum"
              onChange={handleChange}
            >
              {questNumOptions.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </>
  );
};
