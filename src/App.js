import React, { useContext, useState } from 'react';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import './App.css';
import { EnvForm } from 'components/settings';
import { Help as HelpIcon, Settings } from '@mui/icons-material';
import { SaveMenu } from 'components/save/menu';
import { Outlet } from 'react-router-dom';
import { NewsUpdate } from 'components/newsUpdate';
import { Help } from 'components/help';
import { AppContext } from 'MainApp';
import { SupportEnd } from 'components/supportEnd';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { appVersion } = useContext(AppContext);
  const [newsOpen, setNewsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [supportEndOpen, setSupportEndOpen] = useState(true);

  return (
    <>
      <header className="as-header with-bottom-line">
        <div className="left">
          <Typography variant="h2">My Pogues</Typography>
          <Typography variant="h6">
            Sauvegarde et visualisation de questionnaires saisis avec Pogues
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
            <Tooltip title="Aide">
              <IconButton onClick={() => setHelpOpen(true)}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            <Tooltip title={`Voir le "changelog"`}>
              <Button onClick={() => setNewsOpen(true)}>
                <i>{`Version ${appVersion}`}</i>
              </Button>
            </Tooltip>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <EnvForm open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <NewsUpdate open={newsOpen} setOpen={setNewsOpen} />
      <Help open={helpOpen} setOpen={setHelpOpen} />
      <SupportEnd open={supportEndOpen} setOpen={setSupportEndOpen} />
    </>
  );
}

export default App;
