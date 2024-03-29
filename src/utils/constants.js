export const CONF_KEY = 'local-my-pogues-conf';

export const getLocalConf = () => {
  return localStorage.getItem(CONF_KEY) ? JSON.parse(localStorage.getItem(CONF_KEY)) : null;
};

export const DELETED_STATE = 'DELETED';
export const OUTDATED_STATE = 'OUTDATED';
export const OK_STATE = 'OK';
export const OFFLINE_STATE = 'OFFLINE';

export const NONE_QUESTION = 'NONE';
export const COMMENT_TIME_QUESTION = 'COMMENT_TIME';
export const COMMENT_QUESTION = 'COMMENT';
export const TIME_QUESTION = 'TIME';
