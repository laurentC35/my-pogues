import { useState, useEffect } from 'react';

export const useConfiguration = () => {
  const [configuration, setConfiguration] = useState(null);

  useEffect(() => {
    if (!configuration) {
      const loadConfiguration = async () => {
        const response = await fetch(`${process.env.PUBLIC_URL}/configuration.json`);
        const configurationResponse = await response.json();
        setConfiguration(configurationResponse);
      };
      loadConfiguration();
    }
  }, [configuration]);

  return { configuration };
};
