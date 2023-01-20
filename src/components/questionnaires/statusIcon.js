import { Cancel, Warning, WifiOff } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { DELETED_STATE, OUTDATED_STATE } from 'utils/constants';

export const StatusIcon = ({ status }) => {
  const tooltipMessage =
    status === OUTDATED_STATE
      ? 'Sauvegarde dépassée, pensez à la mettre à jour.'
      : status === DELETED_STATE
      ? "Le questionnaire n'existe plus dans Pogues"
      : 'Problème de connexion avec Pogues';

  if (status === OUTDATED_STATE)
    return (
      <Tooltip title={tooltipMessage}>
        <Warning />
      </Tooltip>
    );
  if (status === DELETED_STATE)
    return (
      <Tooltip title={tooltipMessage}>
        <Cancel />
      </Tooltip>
    );
  return (
    <Tooltip title={tooltipMessage}>
      <WifiOff />
    </Tooltip>
  );
};
