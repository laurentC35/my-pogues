import { API } from 'utils/api';

export const useAPI = () => {
  const token = null;
  const getQuestionnaire = (conf, id) => {
    const { poguesBoUrl } = conf;
    return API.getQuestionnaire(poguesBoUrl)(id)(token);
  };

  const getallQuestionnaires = conf => {
    const { poguesBoUrl } = conf;
    return API.getAllQuestionnaires(poguesBoUrl)(token);
  };

  const putQuestionnaire = (conf, id, questionnaire) => {
    const { poguesBoUrl } = conf;
    return API.putQuestionnaire(poguesBoUrl)(id)(token)(questionnaire);
  };

  const postQuestionnaire = (conf, questionnaire) => {
    const { poguesBoUrl } = conf;
    return API.postQuestionnaire(poguesBoUrl)(questionnaire)(token);
  };

  const deleteQuestionnaire = (conf, id) => {
    const { poguesBoUrl } = conf;
    return API.deleteQuestionnaire(poguesBoUrl)(id)(token);
  };

  return {
    getQuestionnaire,
    getallQuestionnaires,
    putQuestionnaire,
    postQuestionnaire,
    deleteQuestionnaire,
  };
};
