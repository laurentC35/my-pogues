import { useLiveQuery } from 'dexie-react-hooks';
import { db } from 'utils/database/db';
import { sortQuestionnairesByDate, sortVizuByDate } from 'utils/questionnaire';

export const useQuestionnaireList = () => {
  const questionnaires = useLiveQuery(() => db.questionnaire.toArray());
  return { questionnaires: (questionnaires || []).sort(sortQuestionnairesByDate) };
};

export const useQuestionnaire = id => {
  const questionnaire = useLiveQuery(() => db.questionnaire.get(id));
  return questionnaire;
};

export const useVisualizationList = questionnaireId => {
  const visualizations = useLiveQuery(
    () => db.visualization.where('questionnaireId').equals(questionnaireId).toArray(),
    [questionnaireId]
  );
  return { visualizations: (visualizations || []).sort(sortVizuByDate) };
};
