const tranformData = data => {
  if (['true', 'false'].includes(data)) return data === 'true';
  if (!Number.isNaN(+data)) return +data;
  if (data) return data;
  return null;
};

export const checkCSV = csvText => {
  const linesOfCSV = csvText.split('\n');
  const [headers] = linesOfCSV;
  const headersName = headers.split(';');
  if (headersName.length !== 4) return false;
  return true;
};

export const checkJson = jsonText => {
  try {
    const lunaticData = JSON.parse(jsonText);
    return lunaticData && lunaticData.stateData && lunaticData.data;
  } catch (e) {
    return false;
  }
};

export const transformDataCSVToDataJSON = csv => {
  const linesOfCSV = csv.split('\n');
  const [, ...lines] = linesOfCSV;
  return {
    stateData: {
      state: null,
      date: null,
      currentPage: null,
    },

    personalization: [],
    data: lines
      .filter(line => line.length > 0)
      .reduce(
        (acc, line) => {
          const [name, value, type] = line.trim().split(';');
          if (type === 'EXTERNAL') {
            return { ...acc, EXTERNAL: { ...acc.EXTERNAL, [name]: tranformData(value) } };
          }
          if (type === 'COLLECTED') {
            return {
              ...acc,
              COLLECTED: {
                ...acc.COLLECTED,
                [name]: { COLLECTED: tranformData(value) },
              },
            };
          }
          return acc;
        },
        {
          EXTERNAL: {},
          COLLECTED: {},
        }
      ),
  };
};

const getLunaticTypeFromPoguesType = poguesType => {
  if (poguesType === 'CollectedVariableType') return 'COLLECTED';
  if (poguesType === 'ExternalVariableType') return 'EXTERNAL';
  return 'CALCULATED';
};

const getExampleType = poguesTypeName => {
  if (poguesTypeName === 'TEXT') return 'Exemple de valeur';
  if (poguesTypeName === 'NUMERIC') return Math.floor(Math.random() * 100);
  if (poguesTypeName === 'BOOLEAN') return true;
  return '';
};

export const poguesQuestionnaireToCsv = ({ Variables: { Variable: questionnaireVariables } }) => {
  return questionnaireVariables.reduce((finalCsv, currentVariable) => {
    const {
      Name,
      type,
      Datatype: { typeName },
    } = currentVariable;
    const lunaticType = getLunaticTypeFromPoguesType(type);
    if (lunaticType === 'CALCULATED') return finalCsv;
    return `${finalCsv}${Name};${getExampleType(typeName)};${getLunaticTypeFromPoguesType(
      type
    )};${typeName}\n`;
  }, 'NAME;VALUE;TYPE;DATA_TYPE\n');
};

export const poguesQuestionnaireToCsvCollecteAndExternalIntegration =
  variableType =>
  ({ Variables: { Variable: questionnaireVariables } }) => {
    return questionnaireVariables.reduce((finalCsv, currentVariable) => {
      const { Name, type } = currentVariable;
      const lunaticType = getLunaticTypeFromPoguesType(type);
      if (lunaticType !== variableType) return finalCsv;
      return `${finalCsv};${Name}`;
    }, 'ID_UE');
  };

export const poguesQuestionnaireToCsvExternalIntegration = ({
  Variables: { Variable: questionnaireVariables },
}) =>
  poguesQuestionnaireToCsvCollecteAndExternalIntegration('EXTERNAL')({
    Variables: { Variable: questionnaireVariables },
  });

export const poguesQuestionnaireToCsvCollectedIntegration = ({
  Variables: { Variable: questionnaireVariables },
}) =>
  poguesQuestionnaireToCsvCollecteAndExternalIntegration('COLLECTED')({
    Variables: { Variable: questionnaireVariables },
  });
