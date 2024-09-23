/**
 * Retrieves a parameter from the URL.
 * 
 * @param {string} param The parameter to extract
 * @returns {string} The value of the parameter
 */
const getParameterFromURL = (param: string): string | null => {
  const regex = new RegExp('[?&]' + encodeURIComponent(param) + '=([^&]*)');
  const parts = regex.exec(window.location.search);
  if (parts) {
    return decodeURIComponent(parts[1]);
  }
  return null;
}

export {
  getParameterFromURL
}