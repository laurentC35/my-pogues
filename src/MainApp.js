import React, { useEffect, useState } from 'react';
import { loadConf, useEnvs } from 'utils/hook';
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';
import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from 'App';
import { QuestionnaireList } from 'components/questionnaires/list';
import { QuestionnaireForm } from 'components/questionnaires/form';
import { Questionnaire } from 'components/questionnaire';

export const AppContext = React.createContext();

const packageInfo = require('../package.json');
const appVersion = packageInfo?.version;

const defaultNotif = { severity: 'success', message: '' };

function MainApp() {
  const [loading, setLoading] = useState(false);
  const [conf, setConf] = useState(null);
  useEffect(() => {
    const loadJsonConf = async () => {
      const conf = await loadConf();
      setConf(conf);
    };
    if (!conf) loadJsonConf();
  }, [conf]);

  const env = useEnvs();

  const [notif, setNotif] = useState(defaultNotif);
  const [notifOpen, setNotifOpen] = useState(false);

  const openNewNotif = ({ severity, message }) => {
    setNotif({ severity, message });
    setNotifOpen(true);
  };

  const handleClose = () => {
    setNotifOpen(false);
  };

  const { environnements } = env;

  return (
    <>
      {conf && environnements?.length > 0 && (
        <AppContext.Provider
          value={{
            setLoading,
            openNewNotif,
            env,
            ghUrl: conf?.ghUrl,
            appVersion,
          }}
        >
          <HashRouter>
            <Routes>
              <Route path="/" element={<App />}>
                <Route
                  index
                  element={
                    <>
                      <QuestionnaireList />
                      <QuestionnaireForm />
                    </>
                  }
                />
              </Route>
              <Route path="questionnaire/:id/visualisations" element={<Questionnaire />} />
            </Routes>
          </HashRouter>
        </AppContext.Provider>
      )}
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 100 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={notifOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={notif.severity} sx={{ width: '100%' }}>
          {notif.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MainApp;
