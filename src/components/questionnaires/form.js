import { styled, alpha } from '@mui/material/styles';
import { Button, Menu } from '@mui/material';
import React, { useContext, useState } from 'react';
import { db } from 'utils/database/db';
import { useAPI } from 'utils/hook';
import { questionnaireToSavedObject } from 'utils/questionnaire';
import { KeyboardArrowDown } from '@mui/icons-material';
import { FormId } from './formId';
import { AppContext } from 'MainApp';
import { FormSearch } from './formSearch';
import { ConfMenu } from './ConfMenu';

const StyledMenu = styled(props => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

export const QuestionnaireForm = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [conf, setConf] = useState(null);

  const [dialog, setDialog] = useState(null);
  const closeDialog = () => setDialog(null);
  const { setLoading, openNewNotif } = useContext(AppContext);
  const { getQuestionnaire } = useAPI();

  const saveQuestionnaire = async id => {
    if (conf) {
      try {
        closeDialog();
        setLoading(true);
        const { data } = await getQuestionnaire(conf, id);
        if (data) {
          await db.questionnaire.put(questionnaireToSavedObject(data));
          openNewNotif({ severity: 'success', message: 'Questionnaire enregistré avec succès' });
        } else
          openNewNotif({
            severity: 'error',
            message: "Erreur lors de l'enregistrement du questionnaire",
          });
      } catch (e) {
        openNewNotif({
          severity: 'error',
          message: "Erreur lors de l'enregistrement du questionnaire",
        });
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
      >
        Ajouter un questionnaire
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <ConfMenu
          from
          item
          action={conf => {
            setConf(conf);
            handleClose();
            setDialog('id');
          }}
          title="À partir d'un identifant"
        />
        <ConfMenu
          from
          item
          action={conf => {
            setConf(conf);
            handleClose();
            setDialog('search');
          }}
          title="Rechercher dans la base de données de Pogues"
        />
      </StyledMenu>
      {dialog === 'id' && <FormId onClose={closeDialog} open save={saveQuestionnaire} />}
      {dialog === 'search' && (
        <FormSearch onClose={closeDialog} open save={saveQuestionnaire} conf={conf} />
      )}
    </>
  );
};
