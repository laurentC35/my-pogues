import { CheckCircle, Download } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { downloadDataAsCSV } from 'utils/api/dataDownload';
import { checkCSV, poguesQuestionnaireToCsv, transformDataCSVToDataJSON } from 'utils/data';
import { QuestionnaireContext } from '..';

export const DataForm = ({ data, setData }) => {
  const { questionnaireTitle, questionnaire } = useContext(QuestionnaireContext);
  const [error, setError] = useState(null);
  const [wellUpload, setWellUpload] = useState(data?.name);
  const [jsonUpload, setJsonUpload] = useState(false);

  const handleChange = event => {
    setJsonUpload(event.target.checked);
  };

  const readCSV = event => {
    setError(null);
    setWellUpload(false);
    const {
      target: { files },
    } = event;
    if (files.length > 0) {
      const csv = files[0];
      const fileReader = new FileReader();
      fileReader.readAsText(csv);
      fileReader.onload = () => {
        const text = fileReader.result;
        const valid = checkCSV(text);
        if (valid) {
          const lunaticData = transformDataCSVToDataJSON(text);
          setData({ name: csv.name, lunaticData });
          setWellUpload(csv.name);
        } else {
          setError(
            <>
              <p>{`Le fichier "${csv.name}" est invalide.`}</p>
              <p>{`Le fichier doit être sous format ".csv" en encodage UTF-8 de la forme :`}</p>
              <code>
                <div>Parent;Value;Label</div>
                <div>;1;libellé 1</div>
                <div>;2;libellé 2</div>
              </code>
              <p>{`Le séparateur doit être le point-virgule : ";" .`}</p>
            </>
          );
        }
      };
    }
  };

  const getCSVExample = () => {
    const csvData = poguesQuestionnaireToCsv(questionnaire);
    downloadDataAsCSV(
      csvData,
      `${questionnaireTitle.toLowerCase().trim().replace(/\s+/g, '-')}-data`
    );
  };

  return (
    <div className="center-button">
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
      {!jsonUpload && (
        <div className="center-button data">
          <Button startIcon={<Download />} variant="contained" onClick={getCSVExample}>
            Exemple de données CSV
          </Button>
          <Button
            variant="contained"
            startIcon={wellUpload ? <CheckCircle /> : null}
            component="label"
            color={wellUpload ? 'success' : 'primary'}
          >
            Charger le CSV
            <input hidden accept=".csv" type="file" onChange={readCSV} />
          </Button>
        </div>
      )}

      {wellUpload && (
        <>
          <br />
          <br />
          <Typography>{`Le fichier de données "${wellUpload}" a bien été chargé.`}</Typography>
        </>
      )}
      {error && (
        <>
          <br />
          <br />
          <Typography
            color={'error'}
          >{`Une erreur est survenu lors du chargement du fichier de données. Veuillez vérifier son format.`}</Typography>
        </>
      )}
    </div>
  );
};
