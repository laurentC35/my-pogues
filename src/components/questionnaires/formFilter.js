import { FormControl, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { filterQuestionnaire, sortQuestionnairesByDate } from 'utils/questionnaire';

export const FormFilter = ({ questionnaires, setQuestionnairesFiltered }) => {
  const [filter, setFilter] = useState('');

  const handleChangeFilter = event => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    if (filter) {
      const newQuestionnaires = filterQuestionnaire([...questionnaires], filter);

      setQuestionnairesFiltered(newQuestionnaires.sort(sortQuestionnairesByDate));
    } else {
      setQuestionnairesFiltered(questionnaires.sort(sortQuestionnairesByDate));
    }
  }, [filter, questionnaires, setQuestionnairesFiltered]);

  return (
    <FormControl
      fullWidth
      variant="standard"
      sx={{
        marginBottom: '15px',
        marginTop: '15px',
        minWidth: '50%',
        backgroundColor: 'white',
      }}
    >
      <TextField
        fullWidth
        id="filter"
        value={filter}
        label={'Rechercher par titre'}
        placeholder={'Ma super enquête...'}
        onChange={handleChangeFilter}
      />
    </FormControl>
  );
};
