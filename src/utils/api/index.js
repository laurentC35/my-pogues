import { fetcher, fetcherForEno, fetcherXMLFile } from './fetcher';

const getRequest = url => token => fetcher(url, token, 'GET', null);
const putRequest = url => token => body => fetcher(url, token, 'PUT', body);
const postRequest = url => token => body => fetcher(url, token, 'POST', body);
const deleteRequest = url => token => fetcher(url, token, 'DELETE', null);

const postXmlRequest = url => token => body => fetcherXMLFile(url, token, 'POST', body);
const postBlobRequest = url => token => blob => fetcherForEno(url, token, blob);

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
  const { mode, pagination, questNum, seqNum, context } = options;
  return postBlobRequest(
    `${apiUrl}/questionnaire/ddi-2-lunatic-json/${mode}?parsingXpathVTL=false&Pagination=${pagination}&QuestNum=${questNum}&SeqNum=${seqNum}&context=${context}&AddFilterResult=true&PreQuestSymbol=false&CommentQuestion=true&includeUnusedCalculatedVariables=false`
  )(token)(ddi);
};

const ddi2JsonLunaticSimple = apiUrl => options => ddi => token => {
  const { context, mode } = options;
  return postBlobRequest(`${apiUrl}/questionnaire/${context}/lunatic-json/${mode}`)(token)(ddi);
};

export const POGUES_API = {
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
