import Dexie from 'dexie';

export const db = new Dexie('MyPoguesDB');

db.version(1).stores({
  questionnaire: 'id, title, poguesDate, saveDate, questionnaire',
});

db.version(2).stores({
  env: '++id, name, conf',
});
