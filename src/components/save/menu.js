import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { FileDownload, Publish, Save } from '@mui/icons-material';
import { exportSave } from 'utils/save';
import { ImportForm } from './import';

export const SaveMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [saveOpen, setSaveOpen] = useState(false);

  const onClickItem = action => e => {
    handleClose();
    action();
  };

  return (
    <>
      <Tooltip title="Exporter / Importer">
        <IconButton onClick={handleClick}>
          <Save />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={onClickItem(() => setSaveOpen(true))}>
          <ListItemIcon>
            <Publish fontSize="small" />
          </ListItemIcon>
          <ListItemText>Importer</ListItemText>
        </MenuItem>
        <MenuItem onClick={onClickItem(exportSave)}>
          <ListItemIcon>
            <FileDownload fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exporter</ListItemText>
        </MenuItem>
      </Menu>
      <ImportForm open={saveOpen} onClose={() => setSaveOpen(false)} />
    </>
  );
};
