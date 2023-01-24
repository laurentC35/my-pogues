import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {
  COMMENT_QUESTION,
  COMMENT_TIME_QUESTION,
  NONE_QUESTION,
  TIME_QUESTION,
} from 'utils/constants';
import { valueOfEndQuestion } from 'utils/questionnaire';

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

export const endGenericQuestionsOptions = [
  { value: NONE_QUESTION, label: 'Aucune question' },
  { value: COMMENT_TIME_QUESTION, label: 'Commentaire + temps de réponse' },
  { value: COMMENT_QUESTION, label: 'Commentaire' },
  { value: TIME_QUESTION, label: 'Temps de réponse' },
];

export const EnoParamsForm = ({ enoParams, setEnoParms }) => {
  const handleChange = e => {
    const { name, value } = e.target;
    setEnoParms({ ...enoParams, [name]: value });
  };

  const handleChangeEndQuestions = e => {
    const { value } = e.target;
    if (value === NONE_QUESTION)
      setEnoParms({ ...enoParams, commentQuest: false, timeQuest: false });
    if (value === COMMENT_TIME_QUESTION)
      setEnoParms({ ...enoParams, commentQuest: true, timeQuest: true });
    if (value === COMMENT_QUESTION)
      setEnoParms({ ...enoParams, commentQuest: true, timeQuest: false });
    if (value === TIME_QUESTION)
      setEnoParms({ ...enoParams, commentQuest: false, timeQuest: true });
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

          <br />
          <FormControl fullWidth className="form-element">
            <InputLabel id="endQuest">Questions de fin génériques</InputLabel>
            <Select
              labelId="endQuest"
              id="endQuest-simple-select"
              value={valueOfEndQuestion(enoParams)}
              label="Questions de fin"
              name="endQuest"
              onChange={handleChangeEndQuestions}
            >
              {endGenericQuestionsOptions.map(({ value, label }) => (
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
