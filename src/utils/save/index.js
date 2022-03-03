import { downloadDataAsJson } from 'utils/api/dataDownload';
import { db } from 'utils/database/db';

export const exportSave = async (e, fileName) => {
  const questionnaires = await db.questionnaire.toArray();
  const envs = await db.env.toArray();
  const finalFileName = fileName ? fileName : `my-pogues-${new Date().getTime()}`;
  downloadDataAsJson({ questionnaires, envs }, finalFileName);
};

export const importSave = async data => {
  const { questionnaires, envs } = data;
  await db.questionnaire.bulkPut(questionnaires);
  await db.env.bulkPut(envs);
};
