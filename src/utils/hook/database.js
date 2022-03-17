import { useLiveQuery } from 'dexie-react-hooks';
import { db } from 'utils/database/db';

export const useQuestionnaireList = () => {
  const questionnaires = useLiveQuery(() => db.questionnaire.toArray());
  return { questionnaires };
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
  return { visualizations };
};
