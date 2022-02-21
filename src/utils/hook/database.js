import { useLiveQuery } from 'dexie-react-hooks';
import { db } from 'utils/database/db';

export const useQuestionnaireList = () => {
  const questionnaires = useLiveQuery(() => db.questionnaire.toArray());
  return { questionnaires };
};
