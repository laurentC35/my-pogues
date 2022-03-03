import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from 'utils/database/db';

const loadConf = async () => {
  const response = await fetch(`${process.env.PUBLIC_URL}/configuration.json`);
  const configurationResponse = await response.json();
  return configurationResponse;
};

export const useEnvs = () => {
  const environnements = useLiveQuery(() => db.env.toArray());
  // Init default env in database
  useEffect(() => {
    const init = async () => {
      const { envs } = await loadConf();
      const defaultEnv = envs[0];
      await db.env.put(defaultEnv);
    };
    if (environnements?.length === 0) {
      init();
    }
  }, [environnements]);

  const saveEnvironnement = async conf => {
    await db.env.put(conf);
  };

  const deleteEnvironnement = async id => {
    await db.env.delete(id);
  };

  const reset = async () => {
    await db.env.clear();
  };

  return {
    environnements,
    saveEnvironnement,
    deleteEnvironnement,
    reset,
  };
};
