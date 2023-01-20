import { ENO_API, POGUES_API } from 'utils/api';

export const useAPI = () => {
  const token = null;

  const initPogues = conf => {
    const { poguesBoUrl } = conf;
    return POGUES_API.init(poguesBoUrl)(token);
  };

  const getQuestionnaire = (conf, id) => {
    const { poguesBoUrl } = conf;
    return POGUES_API.getQuestionnaire(poguesBoUrl)(id)(token);
  };

  const getallQuestionnaires = conf => {
    const { poguesBoUrl } = conf;
    return POGUES_API.getAllQuestionnaires(poguesBoUrl)(token);
  };

  const putQuestionnaire = (conf, id, questionnaire) => {
    const { poguesBoUrl } = conf;
    return POGUES_API.putQuestionnaire(poguesBoUrl)(id)(token)(questionnaire);
  };

  const postQuestionnaire = (conf, questionnaire) => {
    const { poguesBoUrl } = conf;
    return POGUES_API.postQuestionnaire(poguesBoUrl)(questionnaire)(token);
  };

  const deleteQuestionnaire = (conf, id) => {
    const { poguesBoUrl } = conf;
    return POGUES_API.deleteQuestionnaire(poguesBoUrl)(id)(token);
  };

  const getDDI = (conf, questionnaire) => {
    const { poguesBoUrl } = conf;
    return POGUES_API.getDDIQuestionnaire(poguesBoUrl)(questionnaire)(token);
  };

  const getLunaticQuestionnaireFromDDISimple = (conf, ddi) => options => {
    const { enoWsUrl } = conf;
    return ENO_API.ddi2JsonLunaticSimple(enoWsUrl)(options)(ddi)(token);
  };

  const getLunaticQuestionnaireFromDDIFullOptions = (conf, ddi) => options => {
    const { enoWsUrl } = conf;
    return ENO_API.ddi2JsonLunaticFullOptions(enoWsUrl)(options)(ddi)(token);
  };

  const putLunaticQuestionnaire = (conf, id, questionnaire) => {
    const { poguesBoUrl } = conf;
    return POGUES_API.putLunaticQuestionnaire(poguesBoUrl)(id)(token)(questionnaire);
  };

  const postLunaticQuestionnaire = (conf, questionnaire) => {
    const { poguesBoUrl } = conf;
    return POGUES_API.postLunaticQuestionnaire(poguesBoUrl)(questionnaire)(token);
  };

  const deleteLunaticQuestionnaire = (conf, id) => {
    const { poguesBoUrl } = conf;
    return POGUES_API.deleteLunaticQuestionnaire(poguesBoUrl)(id)(token);
  };

  return {
    initPogues,
    putLunaticQuestionnaire,
    postLunaticQuestionnaire,
    deleteLunaticQuestionnaire,
    getQuestionnaire,
    getLunaticQuestionnaireFromDDISimple,
    getLunaticQuestionnaireFromDDIFullOptions,
    getDDI,
    getallQuestionnaires,
    putQuestionnaire,
    postQuestionnaire,
    deleteQuestionnaire,
  };
};
