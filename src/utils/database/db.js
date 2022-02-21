import Dexie from 'dexie';

export const db = new Dexie('MyPoguesDB');

db.version(1).stores({
  questionnaire: 'id, title, poguesDate, saveDate, questionnaire',
});
