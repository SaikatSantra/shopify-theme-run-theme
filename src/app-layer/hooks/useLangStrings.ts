import { useEffect, useState } from 'react';
import safeJSONParse from '../../scripts/utils/safeJsonParse';

const useLangStrings = (langStringData: string): Record<string, string> => {
  const [langStrings, setLangStrings] = useState({} as Record<string, string>);

  useEffect(() => {
    let parsedLangStrings = {};
    try {
      parsedLangStrings = safeJSONParse(langStringData);
    } catch (error) {
      console.info({ error, data: langStringData });
    }
    setLangStrings(parsedLangStrings);
  }, []);

  return langStrings;
};

export default useLangStrings;
