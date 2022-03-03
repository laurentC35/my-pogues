export const CONF_KEY = 'local-my-pogues-conf';

export const getLocalConf = () => {
  return localStorage.getItem(CONF_KEY) ? JSON.parse(localStorage.getItem(CONF_KEY)) : null;
};
