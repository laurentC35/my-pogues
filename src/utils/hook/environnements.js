import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from 'utils/database/db';

const loadConf = async () => {
  const response = await fetch(`${process.env.PUBLIC_URL}/configuration.json`);
  const configurationResponse = await response.json();
  return configurationResponse;
};

export const useEnvs = () => {
  const [defaultConf, setDefaultConf] = useState(null);

  useEffect(() => {
    const loadDefaultConf = async () => {
      const { envs } = await loadConf();
      setDefaultConf(envs[0]);
    };
    if (!defaultConf) loadDefaultConf();
  }, [defaultConf]);

  const environnements = useLiveQuery(() => db.env.toArray());

  // Init default env in database (and update oldConf)
  useEffect(() => {
    const init = async () => {
      await db.env.put(defaultConf);
    };

    const updateOldConf = async () => {
      await environnements.reduce(async (previousPromise, env) => {
        await previousPromise;
        const updateEnv = async () => {
          if (Object.keys(env.conf).length < Object.keys(defaultConf.conf).length) {
            await db.env.put({ ...env, conf: { ...defaultConf.conf, ...env.conf } });
          }
        };

        return updateEnv();
      }, Promise.resolve());
    };

    if (defaultConf && environnements?.length === 0) init();
    if (defaultConf && environnements?.length > 0) updateOldConf();
  }, [defaultConf, environnements]);

  const saveEnvironnement = async conf => {
    await db.env.put(conf);
  };

  const deleteEnvironnement = async id => {
    await db.env.delete(id);
  };

  const reset = async () => {
    await db.env.clear();
  };

  return { environnements, saveEnvironnement, deleteEnvironnement, reset, defaultConf };
};
