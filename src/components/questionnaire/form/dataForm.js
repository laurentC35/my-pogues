import { CheckCircle, Download, UploadFile } from '@mui/icons-material';
import {
  Alert,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useCallback, useContext, useState } from 'react';
import { downloadDataAsCSV } from 'utils/api/dataDownload';
import {
  checkCSV,
  checkJson,
  poguesQuestionnaireToCsv,
  transformDataCSVToDataJSON,
} from 'utils/data';
import { QuestionnaireContext } from '..';

export const DataForm = ({ data, setData }) => {
  const { questionnaireTitle, questionnaire } = useContext(QuestionnaireContext);
  const [error, setError] = useState(null);
  const [jsonUpload, setJsonUpload] = useState(false);

  const handleChange = event => {
    setData(null);
    setJsonUpload(event.target.checked);
  };

  const readFile = useCallback(
    event => {
      setError(null);
      setData(null);
      const {
        target: { files },
      } = event;
      if (files.length > 0) {
        const file = files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = () => {
          const text = fileReader.result;
          const valid = jsonUpload ? checkJson() : checkCSV(text);
          if (valid) {
            const lunaticData = jsonUpload ? JSON.parse(text) : transformDataCSVToDataJSON(text);
            setData({ name: file.name, lunaticData });
          } else {
            setError(true);
          }
        };
      }
    },
    [jsonUpload, setData]
  );

  const getCSVExample = () => {
    const csvData = poguesQuestionnaireToCsv(questionnaire);
    downloadDataAsCSV(
      csvData,
      `${questionnaireTitle.toLowerCase().trim().replace(/\s+/g, '-')}-data`
    );
  };

  return (
    <div>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">Type de format de données</FormLabel>
        <FormGroup>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>CSV</Typography>
            <Switch checked={jsonUpload} onChange={handleChange} />
            <Typography>JSON</Typography>
          </Stack>
        </FormGroup>
      </FormControl>

      <Alert severity={jsonUpload ? 'warning' : 'info'}>
        {jsonUpload && (
          <>
            <div>
              Le format de données JSON sera bientôt disponible. Il correspondra à celui
              exporté/téléchargé en fin de visualisation.
            </div>
            <div>
              Vous pourrez donc, compléter les données d'un questionnaire vierge comme bon vous
              semble et importer ensuite les données ici.
            </div>
          </>
        )}
        {!jsonUpload && (
          <>
            <div>Le format de données CSV est généré à partir des variables du questionnaires.</div>
            <div>
              En cliquant sur "Exemple de données CSV", vous obtiendrez un fichier CSV correspondant
              à votre questionnaire que vous pourrez compléter/modifier pour ensuite le charger ici.
            </div>
          </>
        )}
      </Alert>
      <br />
      <br />
      <div className="center-button data">
        {!jsonUpload && (
          <Button startIcon={<Download />} variant="contained" onClick={getCSVExample}>
            Exemple de données CSV
          </Button>
        )}
        {!jsonUpload && (
          <Button
            variant="contained"
            startIcon={data ? <CheckCircle /> : <UploadFile />}
            component="label"
            color={data ? 'success' : 'primary'}
          >
            {jsonUpload ? 'Charger le JSON' : 'Charger le CSV'}
            <input hidden accept={jsonUpload ? '.json' : '.csv'} type="file" onChange={readFile} />
          </Button>
        )}
      </div>
      {(data || error) && (
        <Box sx={{ margin: 'auto', width: '70%' }}>
          <br />
          <br />
          {data && (
            <Alert severity="success">{`Le fichier de données "${data.name}" a bien été chargé.`}</Alert>
          )}
          {error && (
            <Alert severity="error">{`Une erreur est survenu lors du chargement du fichier de données. Veuillez vérifier son format et recommencer.`}</Alert>
          )}
        </Box>
      )}
    </div>
  );
};
