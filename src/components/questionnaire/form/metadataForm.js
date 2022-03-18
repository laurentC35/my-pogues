import { Close, Edit, SkipNext } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Step,
  StepButton,
  Stepper,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { EndPageForm } from './metadata/endForm';
import { HouseholdForm } from './metadata/householdForm';
import { MainLogoForm } from './metadata/mainLogoForm';
import { ValidationPageForm } from './metadata/validationForm ';
import { WelcomePageForm } from './metadata/welcomeForm';

const steps = [
  `Page d'accueil`,
  'Page de validation',
  'Page de fin',
  `Logo de l'application de collecte`,
  'Fin',
];

const pageStep = ['welcome', 'validation', 'end'];

export const MetadataForm = ({ mode, context, metadata, setMetadata }) => {
  console.log('metadata', metadata);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const [metadataForm, setMetadataForm] = useState(metadata);

  const [metadataEdit, setMetadataEdit] = useState(false);

  const closeMetadataEdit = () => {
    setMetadataEdit(false);
    setCurrentStep(0);
  };

  const [currentEdition, setCurrentEdition] = useState(null);

  const savePage = (pageType, pageContent) => {
    if (metadataForm?.genericPages) {
      setMetadataForm({
        ...metadataForm,
        inseeContext: context.toLowerCase(),
        genericPages: {
          ...metadataForm.genericPages,
          [pageType]: pageContent,
        },
      });
    } else {
      setMetadataForm({
        ...metadataForm,
        inseeContext: context.toLowerCase(),
        genericPages: { [pageType]: pageContent },
      });
    }
  };

  const saveMainLogo = mainLogo => {
    setMetadataForm({
      ...metadataForm,
      inseeContext: context.toLowerCase(),
      mainLogo,
    });
  };

  const handleNext = () => {
    if (currentStep <= pageStep.length - 1 && currentEdition) {
      const page = pageStep[currentStep];
      savePage(page, currentEdition);
    }
    if (currentStep === 3 && currentEdition) {
      saveMainLogo(currentEdition);
    }
    if (currentStep !== steps.length - 1) {
      let newCompleted = { ...completed, [currentStep]: true };
      if (currentStep + 1 === steps.length - 1)
        newCompleted = { ...newCompleted, [currentStep + 1]: true };
      setCompleted(newCompleted);
      setCurrentStep(currentStep + 1);
      setCurrentEdition(null);
    }
  };

  const handlePrevious = () => {
    if (currentStep !== 0) setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    if (currentStep !== steps.length - 1) {
      if (currentStep + 1 === steps.length - 1) {
        setCompleted({ ...completed, [currentStep + 1]: true });
      }
      setCurrentStep(currentStep + 1);
    }
    setCurrentEdition(null);
  };

  const handleStep = step => () => {
    setCurrentStep(step);
  };

  const globaleSave = onlyVariables => () => {
    if (onlyVariables && currentEdition) {
      const newMetadata = {
        inseeContext: context.toLowerCase(),
        variables: Object.entries(currentEdition).map(([name, value]) => {
          return { name, value };
        }),
      };
      setMetadataForm(newMetadata);
      setMetadata(newMetadata);
      setCurrentEdition(null);
    } else setMetadata(metadataForm);
    closeMetadataEdit();
  };

  return (
    <>
      {mode === 'CAPI_CATI' && (
        <Typography>Pas de métadonnées d'enquête pour le mode CAPI / CATI</Typography>
      )}
      {mode !== 'CAPI_CATI' && (
        <div className="center-button">
          <Button startIcon={<Edit />} variant="contained" onClick={() => setMetadataEdit(true)}>
            Editer les métadonnées
          </Button>
        </div>
      )}
      {context === 'HOUSEHOLD' && mode === 'CAWI' && (
        <Dialog open={metadataEdit} onClose={closeMetadataEdit} maxWidth="xl" fullWidth>
          <DialogTitle>
            {`Édition des métadonnées`}
            <IconButton
              aria-label="close"
              onClick={closeMetadataEdit}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <HouseholdForm variables={metadataForm?.variables} save={setCurrentEdition} />
          </DialogContent>
          <DialogActions>
            <Button onClick={globaleSave(true)}>Sauvegarder</Button>
          </DialogActions>
        </Dialog>
      )}
      {context === 'DEFAULT' && (
        <Dialog open={metadataEdit} onClose={closeMetadataEdit} maxWidth="xl" fullWidth>
          <DialogTitle>
            {`Édition des métadonnées`}
            <IconButton
              aria-label="close"
              onClick={closeMetadataEdit}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Stepper nonLinear activeStep={currentStep}>
              {steps.map((label, index) => (
                <Step
                  key={label}
                  completed={completed[index]}
                  className={currentStep === index ? 'active-step' : ''}
                >
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <div className="visu-form">
              {currentStep === 0 && (
                <WelcomePageForm
                  welcomePage={metadataForm?.genericPages?.welcome}
                  save={setCurrentEdition}
                />
              )}
              {currentStep === 1 && (
                <ValidationPageForm
                  validationPage={metadataForm?.genericPages?.validation}
                  save={setCurrentEdition}
                />
              )}
              {currentStep === 2 && (
                <EndPageForm endPage={metadataForm?.genericPages?.end} save={setCurrentEdition} />
              )}
              {currentStep === 3 && (
                <MainLogoForm mainLogo={metadataForm?.mainLogo} save={setCurrentEdition} />
              )}
              {currentStep === steps.length - 1 && (
                <>
                  <Typography>
                    Vous êtes arrivés à la fin de la configuration des métadonnées.
                  </Typography>
                  <Typography>{`Cliquer sur Sauvegarder pour valider les métadonnés.`}</Typography>
                </>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            {currentStep > 0 && <Button onClick={handlePrevious}>Précédent</Button>}
            {currentStep < steps.length - 1 && <Button onClick={handleNext}>Suivant</Button>}

            {currentStep < steps.length - 1 && (
              <Button endIcon={<SkipNext />} onClick={handleSkip}>
                Passer
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button onClick={globaleSave()}>Sauvegarder</Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
