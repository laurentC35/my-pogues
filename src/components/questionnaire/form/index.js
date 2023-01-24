import { Close, SkipNext } from '@mui/icons-material';
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
import { useState } from 'react';
import { DataForm } from './dataForm';
import { EnoParamsForm } from './enoParamsForm';
import { MetadataForm } from './metadataForm';
import { TitleForm } from './titleForm';

const initialFormData = {
  mode: 'CAWI', // 'CAWI' / 'CAPI_CATI' / 'ALL'
  pagination: 'QUESTION', // 'NONE' / 'SEQUENCE' / 'SUBSEQUENCE' / 'QUESTION'
  questNum: 'ALL', // 'ALL' / 'MODULE' /  'NO_NUMBER'
  seqNum: true, // true / false
  context: 'HOUSEHOLD', // 'DEFAULT' / 'HOUSEHOLD' / 'BUSINESS'
  commentQuest: false, // true / false
  timeQuest: false, // true / false
};

const steps = ['Titre', 'Paramètres', 'Métadonnées', 'Données', 'Fin'];

export const GenerationForm = ({ open, onClose, save, conf }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const [titleForm, setTitleForm] = useState('');
  const [enoParamsForm, setEnoParmsForm] = useState(initialFormData);
  const [metadataForm, setMetadataForm] = useState(null);
  const [dataForm, setDataForm] = useState(null);

  const [error, setError] = useState(null);

  const globaleSave = () => {
    save(titleForm, enoParamsForm, metadataForm, dataForm.lunaticData)(conf);
    onClose();
  };

  const stepValid = () => {
    if (currentStep === 0 && titleForm.length === 0) {
      setError('Le nom ne peut pas être vide');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    const isStepValid = stepValid();
    if (isStepValid && currentStep !== steps.length - 1) {
      let newCompleted = { ...completed, [currentStep]: true };
      if (currentStep + 1 === steps.length - 1)
        newCompleted = { ...newCompleted, [currentStep + 1]: true };
      setCompleted(newCompleted);
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePrevious = () => {
    if (currentStep !== 0) setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    if (currentStep !== steps.length - 1) {
      // emptyMetadata
      if (currentStep === 2) {
        // No Empty metadata
        setMetadataForm({
          ...metadataForm,
          inseeContext: enoParamsForm?.context.toLowerCase(),
        });
      }
      if (currentStep + 1 === steps.length - 1) {
        setCompleted({ ...completed, [currentStep + 1]: true });
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStep = step => () => {
    setCurrentStep(step);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {titleForm && `Nouvelle visualisation : ${titleForm}`}
        {!titleForm && `Ajout d'une nouvelle visualisation`}
        <IconButton
          aria-label="close"
          onClick={onClose}
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
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div className="visu-form">
          {currentStep === 0 && <TitleForm title={titleForm} setTitle={setTitleForm} />}
          {currentStep === 1 && (
            <EnoParamsForm enoParams={enoParamsForm} setEnoParms={setEnoParmsForm} />
          )}
          {currentStep === 2 && (
            <MetadataForm
              mode={enoParamsForm?.mode}
              context={enoParamsForm?.context}
              metadata={metadataForm}
              setMetadata={setMetadataForm}
            />
          )}
          {currentStep === 3 && <DataForm data={dataForm} setData={setDataForm} />}
          {currentStep === steps.length - 1 && (
            <>
              <Typography>
                Vous êtes arrivés à la fin de la configuration pour la visualisation.
              </Typography>
              <Typography>{`Cliquer sur Sauvegarder pour valider la visualisation "${titleForm}".`}</Typography>
            </>
          )}
        </div>
        <div className="info">
          <Typography color="error">{error}</Typography>
        </div>
      </DialogContent>
      <DialogActions>
        {currentStep > 0 && <Button onClick={handlePrevious}>Précédent</Button>}
        {currentStep < steps.length - 1 && (currentStep !== 2 || metadataForm) && (
          <Button onClick={handleNext}>Suivant</Button>
        )}

        {currentStep < steps.length - 1 && currentStep === 2 && !metadataForm && (
          <Button endIcon={<SkipNext />} onClick={handleSkip}>
            Passer
          </Button>
        )}
        {currentStep === steps.length - 1 && <Button onClick={globaleSave}>Sauvegarder</Button>}
      </DialogActions>
    </Dialog>
  );
};
