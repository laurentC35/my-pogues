export const questionnaireToDisplaySearch = questionnaire => {
  const { id, Label, lastUpdatedDate } = questionnaire;
  return {
    id: id,
    title: Label[0],
    poguesDate: lastUpdatedDate,
    questionnaire: questionnaire,
  };
};

export const questionnaireToSavedObject = (questionnaire, conf) => {
  return {
    ...questionnaireToDisplaySearch(questionnaire),
    saveDate: new Date().getTime(),
    conf,
  };
};

export const filterQuestionnaire = (questionnaires = [], filterStr) => {
  return questionnaires.filter(({ title }) =>
    `${title}`.toLowerCase().includes(filterStr.toLowerCase())
  );
};

/**
 *
 * @param {*} generatingDate : format : dd-MM-yyyy HH:mm:ss (UTC : GMT+00)
 * @returns js Date
 */
export const enoDateToJsDate = generatingDate => {
  const regexDate = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
  const [dayStr, mouthStr, yearStr, hoursStr, minutesStr, secondsStr] = generatingDate
    .match(regexDate)
    .slice(1);
  const day = parseInt(dayStr);
  const mouth = parseInt(mouthStr) - 1;
  const year = parseInt(yearStr);
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);
  const seconds = parseInt(secondsStr);
  return new Date(Date.UTC(year, mouth, day, hours, minutes, seconds));
};

export const sortQuestionnairesByDate = (q1, q2) => {
  const date1 = new Date(q1.poguesDate).getTime();
  const date2 = new Date(q2.poguesDate).getTime();
  if (date1 > date2) return -1;
  if (date1 < date2) return 1;
  return 0;
};

export const sortVizuByDate = (v1, v2) => {
  const {
    jsonLunatic: { generatingDate: generatingDate1 },
  } = v1;
  const {
    jsonLunatic: { generatingDate: generatingDate2 },
  } = v2;
  const date1 = enoDateToJsDate(generatingDate1).getTime();
  const date2 = enoDateToJsDate(generatingDate2).getTime();
  if (date1 > date2) return -1;
  if (date1 < date2) return 1;
  return 0;
};
