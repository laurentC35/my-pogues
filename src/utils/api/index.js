import { fetcher, fetcherForEno, fetcherForEnoJava, fetcherXMLFile } from './fetcher';

const getRequest = url => token => fetcher(url, token, 'GET', null);
const putRequest = url => token => body => fetcher(url, token, 'PUT', body);
const postRequest = url => token => body => fetcher(url, token, 'POST', body);
const deleteRequest = url => token => fetcher(url, token, 'DELETE', null);

const postXmlRequest = url => token => body => fetcherXMLFile(url, token, 'POST', body);
const postBlobRequest = url => token => blob => fetcherForEno(url, token, blob);
const postMultiBlobRequest = url => token => blob => params =>
  fetcherForEnoJava(url, token, blob, params);

const init = apiUrl => token => getRequest(`${apiUrl}/api/init`)(token);

const getQuestionnaire = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/persistence/questionnaire/${id}`)(token);

const getAllQuestionnaires = apiUrl => token =>
  getRequest(`${apiUrl}/api/persistence/questionnaires`)(token);

const putQuestionnaire = apiUrl => id => token => body =>
  putRequest(`${apiUrl}/api/persistence/questionnaire/${id}`)(token)(body);

const postQuestionnaire = apiUrl => body => token =>
  postRequest(`${apiUrl}/api/persistence/questionnaires`)(token)(body);

const deleteQuestionnaire = apiUrl => id => token =>
  deleteRequest(`${apiUrl}/api/persistence/questionnaire/${id}`)(token);

const postLunaticQuestionnaire = apiUrl => body => token =>
  postRequest(`${apiUrl}/api/persistence/questionnaires/json-lunatic`)(token)(body);

const putLunaticQuestionnaire = apiUrl => id => token => body =>
  putRequest(`${apiUrl}/api/persistence/questionnaire/json-lunatic/${id}`)(token)(body);

const deleteLunaticQuestionnaire = apiUrl => id => token =>
  deleteRequest(`${apiUrl}/api/persistence/questionnaire/json-lunatic/${id}`)(token);

const getDDIQuestionnaire = apiUrl => body => token =>
  postXmlRequest(`${apiUrl}/api/transform/visualize-ddi`)(token)(body);

const ddi2JsonLunaticFullOptions = apiUrl => options => ddi => token => {
  const { mode, pagination, questNum, seqNum, context, commentQuest, timeQuest } = options;
  const params = {
    context: context,
    modeParameter: mode,
    outFormat: 'LUNATIC',
    campaignName: 'test-2020-x00',
    language: 'FR',
    identificationQuestion: false,
    responseTimeQuestion: timeQuest,
    commentSection: commentQuest,
    sequenceNumbering: seqNum,
    questionNumberingMode: questNum,
    arrowCharInQuestions: true,
    selectedModes: [mode],
    lunatic: {
      controls: true,
      toolTip: true,
      missingVariables: true,
      filterResult: true,
      filterDescription: false,
      lunaticPaginationMode: 'QUESTION',
    },
  };
  return postMultiBlobRequest(`${apiUrl}/questionnaire/ddi-2-lunatic-json`)(token)(ddi)(params);
};

const ddi2JsonLunaticSimple = apiUrl => options => ddi => token => {
  const { context, mode } = options;
  return postBlobRequest(`${apiUrl}/questionnaire/${context}/lunatic-json/${mode}`)(token)(ddi);
};

export const POGUES_API = {
  init,
  getQuestionnaire,
  getAllQuestionnaires,
  putQuestionnaire,
  postQuestionnaire,
  deleteQuestionnaire,
  postLunaticQuestionnaire,
  putLunaticQuestionnaire,
  deleteLunaticQuestionnaire,
  getDDIQuestionnaire,
};

export const ENO_API = {
  ddi2JsonLunaticFullOptions,
  ddi2JsonLunaticSimple,
};
