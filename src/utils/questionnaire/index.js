export const questionnaireToSavedObject = questionnaire => {
  const { id, Label, lastUpdatedDate } = questionnaire;
  return {
    id: id,
    title: Label[0],
    poguesDate: lastUpdatedDate,
    saveDate: new Date().getTime(),
    questionnaire: questionnaire,
  };
};

export const questionnaireToDisplaySearch = questionnaire => {
  const { id, Label, lastUpdatedDate } = questionnaire;
  return {
    id: id,
    title: Label[0],
    poguesDate: lastUpdatedDate,
    questionnaire: questionnaire,
  };
};
