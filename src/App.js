import React, { useState } from 'react';
import { useConfiguration } from 'utils/hook';
import { Alert, Backdrop, CircularProgress, Snackbar, Typography } from '@mui/material';
import './App.css';
import { QuestionnaireList } from 'components/questionnaire/list';
import { QuestionnaireForm } from 'components/questionnaire/form';

export const AppContext = React.createContext();

const defaultNotif = { severity: 'success', message: '' };

function App() {
  const [loading, setLoading] = useState(false);
  const { configuration } = useConfiguration();

  const [notif, setNotif] = useState(defaultNotif);
  const [notifOpen, setNotifOpen] = useState(false);

  const openNewNotif = ({ severity, message }) => {
    setNotif({ severity, message });
    setNotifOpen(true);
  };

  const handleClose = () => {
    setNotifOpen(false);
  };

  return (
    <>
      {configuration && (
        <AppContext.Provider value={{ ...configuration, setLoading, openNewNotif }}>
          <header>
            <Typography variant="h2">My Pogues</Typography>
            <Typography variant="h6">Sauvegarde de questionnaire de Pogues du Cloud</Typography>
            <Typography>
              <i>Les questionnaires sont sauvegardés dans votre navigateur</i>
            </Typography>
          </header>
          <QuestionnaireList />
          <QuestionnaireForm />
        </AppContext.Provider>
      )}
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 100 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={notifOpen} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={notif.severity} sx={{ width: '100%' }}>
          {notif.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
