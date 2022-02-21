import { fetcher } from './fetcher';

const getRequest = url => token => fetcher(url, token, 'GET', null);
const putRequest = url => token => body => fetcher(url, token, 'PUT', body);
const postRequest = url => token => body => fetcher(url, token, 'POST', body);
const deleteRequest = url => token => fetcher(url, token, 'DELETE', null);

const getQuestionnaire = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/persistence/questionnaire/${id}`)(token);

/* SurveyUnit's data */
const putQuestionnaire = apiUrl => id => token => body =>
  putRequest(`${apiUrl}/api/persistence/questionnaire/${id}`)(token)(body);

const postQuestionnaire = apiUrl => body => token =>
  postRequest(`${apiUrl}/api/persistence/questionnaires`)(token)(body);

const deleteQuestionnaire = apiUrl => id => token =>
  deleteRequest(`${apiUrl}/api/persistence/questionnaire/${id}`)(token);

const getAllQuestionnaires = apiUrl => token =>
  getRequest(`${apiUrl}/api/persistence/questionnaires`)(token);

export const API = {
  getQuestionnaire,
  getAllQuestionnaires,
  putQuestionnaire,
  postQuestionnaire,
  deleteQuestionnaire,
};
