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
