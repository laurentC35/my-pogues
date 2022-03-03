import React, { useState } from 'react';
import { useEnvs } from 'utils/hook';
import {
  Alert,
  Backdrop,
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import './App.css';
import { EnvForm } from 'components/settings';
import { Settings } from '@mui/icons-material';
import { QuestionnaireList } from 'components/questionnaire/list';
import { QuestionnaireForm } from 'components/questionnaire/form';
import { SaveMenu } from 'components/save/menu';

export const AppContext = React.createContext();

const defaultNotif = { severity: 'success', message: '' };

function App() {
  const [loading, setLoading] = useState(false);

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

  const [settingsOpen, setSettingsOpen] = useState(false);

  const { environnements } = env;

  return (
    <>
      {environnements?.length > 0 && (
        <AppContext.Provider
          value={{
            setLoading,
            openNewNotif,
            env,
          }}
        >
          <header>
            <div className="left">
              <Typography variant="h2">My Pogues</Typography>
              <Typography variant="h6">Sauvegarde de questionnaire de Pogues</Typography>
              <Typography>
                <i>Les questionnaires sont sauvegardés dans votre navigateur</i>
              </Typography>
            </div>
            <div className="right">
              <SaveMenu />
              <Tooltip title="Modifier la configuration">
                <IconButton onClick={() => setSettingsOpen(true)}>
                  <Settings />
                </IconButton>
              </Tooltip>
            </div>
          </header>
          <QuestionnaireList />
          <QuestionnaireForm />
          <EnvForm open={settingsOpen} onClose={() => setSettingsOpen(false)} />
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
