import { AppContext } from 'App';
import { useCallback, useContext } from 'react';
import { API } from 'utils/api';

export const useAPI = () => {
  const token = null;
  const { poguesBoUrl: apiUrl } = useContext(AppContext);

  const getQuestionnaire = useCallback(
    id => {
      return API.getQuestionnaire(apiUrl)(id)(token);
    },
    [apiUrl]
  );

  const getallQuestionnaires = useCallback(() => {
    return API.getAllQuestionnaires(apiUrl)(token);
  }, [apiUrl]);

  const putQuestionnaire = useCallback(
    (id, questionnaire) => {
      return API.putQuestionnaire(apiUrl)(id)(token)(questionnaire);
    },
    [apiUrl]
  );

  const postQuestionnaire = useCallback(
    questionnaire => {
      return API.postQuestionnaire(apiUrl)(questionnaire)(token);
    },
    [apiUrl]
  );

  const deleteQuestionnaire = useCallback(
    id => {
      return API.deleteQuestionnaire(apiUrl)(id)(token);
    },
    [apiUrl]
  );

  return {
    getQuestionnaire,
    getallQuestionnaires,
    putQuestionnaire,
    postQuestionnaire,
    deleteQuestionnaire,
  };
};
