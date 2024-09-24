import parseJson from 'json-parse-better-errors';

type sjP = (
  str: string,
  respondWithOnFail?: any,
) => boolean | Record<string, unknown> | any[];

const safeJSONParse: sjP = (str: string, respondWithOnFail: any = false) => {
  if (typeof str !== 'string') {
    return respondWithOnFail;
  }
  try {
    const jsonReturn = parseJson(str);
    return jsonReturn;
  } catch (error) {
    return respondWithOnFail;
  }
};
export default safeJSONParse;
