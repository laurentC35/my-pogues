import Dexie from 'dexie';

export const db = new Dexie('MyPoguesDB');

db.version(1).stores({
  questionnaire: 'id, title, poguesDate, saveDate, questionnaire',
});

db.version(2).stores({
  env: '++id, name, conf',
});

db.version(3).stores({
  visualization:
    '++id, questionnaireId, idLunatic, idMetadata,title, url, jsonLunatic, enoParams, metadata',
});

db.version(4)
  .stores({
    questionnaire: 'id, title, poguesDate, saveDate, questionnaire, conf',
  })
  .upgrade(async trans => {
    return trans.questionnaire.toCollection().modify(async questionnaire => {
      const response = await fetch(`${process.env.PUBLIC_URL}/configuration.json`);
      const { envs } = await response.json();
      delete questionnaire.confs;
      questionnaire.conf = envs[0].conf;
    });
  });
