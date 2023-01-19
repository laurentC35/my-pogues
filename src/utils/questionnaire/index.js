import { getLocalConf } from 'utils/constants';

export const questionnaireToDisplaySearch = questionnaire => {
  const { id, Label, lastUpdatedDate } = questionnaire;
  return {
    id: id,
    title: Label[0],
    poguesDate: lastUpdatedDate,
    questionnaire: questionnaire,
  };
};

export const questionnaireToSavedObject = questionnaire => {
  return {
    ...questionnaireToDisplaySearch(questionnaire),
    saveDate: new Date().getTime(),
    confs: { cloud: getLocalConf() },
  };
};

export const filterQuestionnaire = (questionnaires = [], filterStr) => {
  return questionnaires.filter(({ title }) =>
    `${title}`.toLowerCase().includes(filterStr.toLowerCase())
  );
};

export const sortQuestionnairesByDate = (q1, q2) => {
  const date1 = new Date(q1.poguesDate).getTime();
  const date2 = new Date(q2.poguesDate).getTime();
  if (date1 > date2) return -1;
  if (date1 < date2) return 1;
  return 0;
};
