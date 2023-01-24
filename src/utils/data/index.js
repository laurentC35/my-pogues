const tranformData = data => {
  if (['true', 'false'].includes(data)) return data === 'true';
  if (!Number.isNaN(+data)) return +data;
  if (data) return data;
  return null;
};

export const checkCSV = csv => {
  const linesOfCSV = csv.split('\n');
  const [headers] = linesOfCSV;
  const headersName = headers.split(';');
  if (headersName.length !== 4) return false;
  return true;
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
    return `${finalCsv}${Name};${getExampleType(typeName)};${getLunaticTypeFromPoguesType(
      type
    )};${typeName}\n`;
  }, 'NAME;VALUE;TYPE;DATA_TYPE\n');
};
