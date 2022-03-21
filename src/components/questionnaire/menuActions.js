import { styled, alpha } from '@mui/material/styles';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import {
  Backup,
  CloudDownload,
  Download,
  FileUpload,
  KeyboardArrowDown,
  Visibility,
} from '@mui/icons-material';
import { ConfMenu } from 'components/questionnaires/ConfMenu';
import { useActions } from 'utils/hook';

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

export const MenuActions = ({ questionnaireId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    createQuestionnaire,
    downloadQuestionnaire,
    openPogues,
    updateQuestionnaireFromLocal,
    updateQuestionnaireFromPogues,
  } = useActions();

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
        Actions
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
          item
          action={openPogues(questionnaireId)}
          title={'Ouvrir dans Pogues'}
          startIcon={<Visibility />}
        />
        <ConfMenu
          from
          item
          action={updateQuestionnaireFromPogues(questionnaireId)}
          title={'Mettre à jour la sauvegarde'}
          startIcon={<CloudDownload />}
        />
        <ConfMenu
          item
          action={updateQuestionnaireFromLocal(questionnaireId)}
          title={'Remplacer la version de Pogues par celle-ci'}
          startIcon={<Backup />}
        />
        <MenuItem onClick={() => downloadQuestionnaire(questionnaireId)}>
          <ListItemIcon>{<Download />}</ListItemIcon>
          <ListItemText>{'Télécharger le questionnaire'}</ListItemText>
        </MenuItem>
        <ConfMenu
          item
          action={createQuestionnaire(questionnaireId)}
          title={'Créer le questionnaire dans Pogues'}
          startIcon={<FileUpload />}
        />
      </StyledMenu>
    </>
  );
};
