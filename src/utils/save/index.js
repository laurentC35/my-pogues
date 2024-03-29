import { downloadDataAsJson } from 'utils/api/dataDownload';
import { db } from 'utils/database/db';

export const exportSave = async (e, fileName) => {
  const questionnaires = await db.questionnaire.toArray();
  const envs = await db.env.toArray();
  const visualizations = await db.visualization.toArray();
  const finalFileName = fileName ? fileName : `my-pogues-${new Date().getTime()}`;
  downloadDataAsJson({ questionnaires, envs, visualizations }, finalFileName);
};

export const importSave = async (data, defaultConf) => {
  const { questionnaires, envs, visualizations } = data;
  if (questionnaires) {
    const newQuestionnaire = questionnaires.map(q => {
      const { conf, confs, ...other } = q;
      if (!conf) return { conf: defaultConf, ...other };
      return other;
    });
    await db.questionnaire.bulkPut(newQuestionnaire);
  }
  if (envs) await db.env.bulkPut(envs);
  if (visualizations) await db.visualization.bulkPut(visualizations);
};
