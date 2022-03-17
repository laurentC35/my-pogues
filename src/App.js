import React, { useContext, useState } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import './App.css';
import { EnvForm } from 'components/settings';
import { Settings } from '@mui/icons-material';
import { SaveMenu } from 'components/save/menu';
import { Outlet } from 'react-router-dom';
import { NewsUpdate } from 'components/newsUpdate';
import { AppContext } from 'MainApp';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { appVersion } = useContext(AppContext);

  return (
    <>
      <header className="as-header with-bottom-line">
        <div className="left">
          <Typography variant="h2">My Pogues</Typography>
          <Typography variant="h6">
            Sauvegarde et visualisation de questionnaire de Pogues
          </Typography>
          <Typography>
            <i>Les questionnaires et visualisations sont sauvegardés dans votre navigateur</i>
          </Typography>
        </div>
        <div className="right">
          <div className="icons">
            <SaveMenu />
            <Tooltip title="Modifier la configuration">
              <IconButton onClick={() => setSettingsOpen(true)}>
                <Settings />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            <i>{`Version ${appVersion}`}</i>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <EnvForm open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <NewsUpdate />
    </>
  );
}

export default App;
