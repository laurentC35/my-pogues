import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { format } from 'date-fns';
import { AppContext } from 'App';
import React, { useContext, useEffect, useState } from 'react';
import { useAPI } from 'utils/hook';
import { questionnaireToDisplaySearch } from 'utils/questionnaire';

export const FormSearch = ({ open, onClose, id, setId, save }) => {
  const { setLoading } = useContext(AppContext);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const [questionnaires, setQuestionnaires] = useState(null);

  const { getallQuestionnaires } = useAPI();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await getallQuestionnaires();
      if (data && Array.isArray(data)) {
        setQuestionnaires(data);
      }
      setLoading(false);
    };
    if (!questionnaires) load();
  }, [getallQuestionnaires, questionnaires, setLoading]);

  const confirm = () => {
    const { id } = selectedQuest;
    save(id);
  };
  const cancel = () => {
    setSelectedQuest(null);
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ zIndex: theme => theme.zIndex.drawer + 10 }}>
      <DialogTitle>Ajouter un nouveau questionnaire</DialogTitle>
      <DialogContent>
        {selectedQuest && (
          <>
            <DialogContentText>Confimez vous l'ajout de ce questionnaire ?</DialogContentText>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Titre</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={selectedQuest?.id}>
                    <TableCell>{selectedQuest?.id}</TableCell>
                    <TableCell>{selectedQuest?.title}</TableCell>
                    <TableCell>
                      {format(new Date(selectedQuest?.poguesDate), 'dd/MM/yyyy à HH:mm:ss')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {!selectedQuest && questionnaires && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Titre</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questionnaires.map(q => {
                  const { id, title, poguesDate } = questionnaireToDisplaySearch(q);
                  return (
                    <TableRow key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{title}</TableCell>
                      <TableCell>{format(new Date(poguesDate), 'dd/MM/yyyy à HH:mm:ss')}</TableCell>
                      <TableCell>
                        <Button onClick={() => setSelectedQuest(questionnaireToDisplaySearch(q))}>
                          Séléctionner
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {!questionnaires && <Typography>Chargement des questionnaires ...</Typography>}
      </DialogContent>
      {selectedQuest && (
        <DialogActions>
          <Button onClick={cancel}>Non</Button>
          <Button onClick={confirm}>Oui</Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
