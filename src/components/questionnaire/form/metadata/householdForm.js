import { Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const variablesForWelcome = [
  { name: 'Enq_LibelleEnquete', label: `Libellé de l'enquête`, default: '' },
  { name: 'Enq_ObjectifsCourts', label: `Objectifs de l'enquête`, default: '' },
  { name: 'whoAnswers1', label: `Qui répond, 1ère ligne`, default: '' },
  { name: 'whoAnswers2', label: `Qui répond, 2ème ligne`, default: '' },
  { name: 'whoAnswers3', label: `Qui répond, 3ème ligne`, default: '' },

  {
    name: 'Enq_CaractereObligatoire',
    label: `Enquête obligatoire`,
    type: 'boolean',
    default: false,
  },
  {
    name: 'Enq_QualiteStatistique',
    label: `Enquête de qualité statistique`,
    type: 'boolean',
    default: false,
  },
  { name: 'Enq_NumeroVisa', label: `Numéro du visa de parution`, default: '' },
  { name: 'Enq_AnneeVisa', label: `Année du visa`, type: 'number', default: '' },
  {
    name: 'Enq_ParutionJo',
    label: `Visa publié au journal officiel`,
    type: 'boolean',
    default: false,
  },
  {
    name: 'Enq_DateParutionJo',
    label: `Date de parution du visa au journal officiel`,
    default: '',
  },
  { name: 'Enq_MinistereTutelle', label: `Ministère tutelle`, default: '' },
  { name: 'Enq_RespOperationnel', label: `Responsable opérationnel de l'enquête`, default: '' },
  {
    name: 'Enq_RespTraitement',
    label: `Responsable du traitement des données de l'enquête`,
    default: '',
  },
  {
    name: 'Loi_statistique',
    label: `Url vers la loi statistique`,
    default: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000888573',
  },
  {
    name: 'Loi_rgpd',
    label: `Url vers la loi rgpd`,
    default: 'https://www.cnil.fr/fr/reglement-europeen-protection-donnees',
  },
  {
    name: 'Loi_informatique',
    label: `Url vers la loi informatique et liberté`,
    default: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460',
  },
];

export const HouseholdForm = ({ variables, save }) => {
  const [formData, setFormData] = useState(() => {
    return (variables || variablesForWelcome).reduce(
      (acc, { name, default: defaultValue, value }) => {
        return { ...acc, [name]: value || defaultValue };
      },
      {}
    );
  });

  const updateData = data => {
    setFormData(data);
    save(data);
  };

  const onChangeBoolean = name => e => {
    updateData({ ...formData, [name]: e.target.checked });
  };

  const onChange = name => e => {
    updateData({ ...formData, [name]: e.target.value });
  };

  return (
    <>
      <Typography>Merci de compléter les variables ci-dessous : </Typography>
      {variablesForWelcome.map(({ name, label, default: defaultValue, type }) => {
        if (type === 'boolean')
          return (
            <FormControlLabel
              key={name}
              control={
                <Checkbox
                  checked={formData[name]}
                  onChange={onChangeBoolean(name)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={label}
            />
          );
        const textField = (
          <TextField
            key={name}
            className="name-form"
            placeholder={defaultValue}
            margin="dense"
            label={label}
            fullWidth
            variant="standard"
            value={formData[name]}
            onChange={onChange(name)}
          />
        );
        if (name === 'Enq_DateParutionJo') {
          if (formData['Enq_ParutionJo']) return textField;
          return null;
        }
        return textField;
      })}
    </>
  );
};
