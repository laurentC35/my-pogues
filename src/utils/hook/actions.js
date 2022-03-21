import { AppContext } from 'MainApp';
import { useContext } from 'react';
import { downloadDataAsJson } from 'utils/api/dataDownload';
import { db } from 'utils/database/db';
import { questionnaireToSavedObject } from 'utils/questionnaire';
import { useAPI } from './api';

export const useActions = () => {
  const { setLoading, openNewNotif } = useContext(AppContext);

  const setSuccessMessage = newMessage => {
    openNewNotif({ severity: 'success', message: newMessage });
  };

  const setErrorMessage = newMessage => {
    openNewNotif({ severity: 'error', message: newMessage });
  };

  const {
    getQuestionnaire,
    putQuestionnaire,
    postQuestionnaire,
    deleteQuestionnaire: deleteQuestionnaireApi,
  } = useAPI();

  const deleteQuestionnaire =
    (id, deletePogues = false) =>
    async conf => {
      setLoading(true);
      let success = false;
      try {
        if (deletePogues) {
          const { status } = await deleteQuestionnaireApi(conf, id);
          if (status === 204) {
            await db.visualization.where('questionnaireId').equals(id).delete();
            await db.questionnaire.delete(id);
            success = true;
          }
        } else {
          await db.visualization.where('questionnaireId').equals(id).delete();
          await db.questionnaire.delete(id);
          success = true;
        }
      } catch (e) {}
      if (success) setSuccessMessage('Suppression bien effectuée');
      else setErrorMessage('Erreur lors de la suppression');
      setLoading(false);
    };

  const downloadQuestionnaire = async id => {
    try {
      const { questionnaire } = await db.questionnaire.get(id);
      if (questionnaire) {
        downloadDataAsJson(questionnaire, `${id}`);
      }
    } catch (e) {}
  };

  const updateQuestionnaireFromPogues = id => async conf => {
    setLoading(true);
    let success = false;
    try {
      const { data } = await getQuestionnaire(conf, id);
      if (data) {
        await db.questionnaire.put(questionnaireToSavedObject(data));
        success = true;
      }
    } catch (e) {}
    if (success) setSuccessMessage('Mise à jour effectuée');
    else setErrorMessage('Erreur lors de la mise à jour');
    setLoading(false);
  };

  const createQuestionnaire = id => async conf => {
    setLoading(true);
    let success = false;
    try {
      const { questionnaire } = await db.questionnaire.get(id);
      if (questionnaire) {
        const { status } = await postQuestionnaire(conf, questionnaire);
        if (status === 201) success = true;
      }
    } catch (e) {}
    if (success) setSuccessMessage('Le questionnaire a bien été créé dans Pogues');
    else setErrorMessage('Erreur lors de la création du questionnaire dans Pogues');
    setLoading(false);
  };

  const updateQuestionnaireFromLocal = id => async conf => {
    setLoading(true);
    let success = false;
    try {
      const { questionnaire } = await db.questionnaire.get(id);
      if (questionnaire) {
        const { status } = await putQuestionnaire(conf, id, questionnaire);
        if (status === 204) success = true;
      }
    } catch (e) {}
    if (success) setSuccessMessage('Mise à jour effectuée');
    else setErrorMessage('Erreur lors de la mise à jour');
    setLoading(false);
  };

  const openPogues = id => conf => {
    const { poguesUrl } = conf;
    window.open(`${poguesUrl}/questionnaire/${id}`, '_blank');
  };

  return {
    deleteQuestionnaire,
    createQuestionnaire,
    downloadQuestionnaire,
    updateQuestionnaireFromPogues,
    updateQuestionnaireFromLocal,
    openPogues,
  };
};
