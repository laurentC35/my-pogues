import { Close, ArrowForwardIos } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from 'MainApp';

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Accordion = styled(props => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  ({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  })
);

const AccordionSummary = styled(props => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIos sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  fontWeight: 'bold',
}));

export const NewsUpdate = ({ open, setOpen }) => {
  const [lastVersion] = useState(window.localStorage.getItem('my-pogues-version') || '');
  const [init, setInit] = useState(false);
  const [updates, setUpdates] = useState(null);
  const { appVersion } = useContext(AppContext);

  useEffect(() => {
    const loadUpdates = async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/updates.json`);
      const { updates: updatesValues } = await response.json();
      setUpdates(updatesValues);
      setInit(true);
    };

    if (!init && !updates) loadUpdates();
  }, [appVersion, init, lastVersion, updates]);

  useEffect(() => {
    if (init && updates && lastVersion !== appVersion) setOpen(true);
  }, [appVersion, init, lastVersion, setOpen, updates]);

  const close = () => {
    setOpen(false);
    window.localStorage.setItem('my-pogues-version', appVersion);
    setExpanded(0);
  };

  const [expanded, setExpanded] = useState(0);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md">
      <DialogTitle>
        Jeter un oeil aux évolutions de l'application !
        <IconButton
          aria-label="close"
          onClick={close}
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
        {updates && (
          <>
            {updates.map(({ title, content }, index) => {
              return (
                <Accordion
                  key={`${title}-${index}`}
                  expanded={expanded === index}
                  onChange={handleChange(index)}
                >
                  <AccordionSummary>{`${title}${
                    index === 0 ? '  - [Nouvelle version]' : ''
                  } `}</AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {content.map((el, i) => (
                        <li key={`${el}-${i}`}>
                          <Typography>{el}</Typography>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};
