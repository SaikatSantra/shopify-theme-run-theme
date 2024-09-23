const axios = require("axios");
const API_VERSION = "2021-04";

/**
 * Retrieves all themes.
 *
 * @param {string} store
 * @param {string} username
 * @param {string} pass
 */
const getThemes = (store, username, pass) => {
  return axios
    .get(
      `https://${username}:${pass}@${store}/admin/api/${API_VERSION}/themes.json`,
    )
    .then((response) => {
      if (response.data) {
        return response.data.themes;
      }
      return [];
    });
};

/**
 * Finds out what the published theme id is
 */
const findPublishedTheme = (store, username, pass) => {
  console.log(`Finding pushblished store... ${store}`); // eslint-disable-line no-console
  return axios
    .get(
      `https://${username}:${pass}@${store}/admin/api/${API_VERSION}/themes.json`,
    )
    .then((response) => {
      if (response.data) {
        const themes = response.data.themes;
        const publishedTheme = themes.find((theme) => theme.role === "main");

        return publishedTheme;
      }

      return null;
    });
};

/**
 * Deletes a theme with a specific ID.
 *
 * @param {int} themeId
 * @param {string} store
 * @param {string} username
 * @param {string} pass
 */
const deleteTheme = (themeId, store, username, pass) => {
  return axios
    .delete(
      `https://${username}:${pass}@${store}/admin/api/${API_VERSION}/themes/${themeId}.json`,
    )
    .catch((err) => console.log(err.response.data)); // eslint-disable-line no-console
};

/**
 * Deletes a theme with a specific name
 *
 * @param {string} themeName
 * @param {string} store
 * @param {string} username
 * @param {string} pass
 */
const deleteThemeByName = (themeName, store, username, pass) => {
  return getThemes(store, username, pass).then((themes) => {
    const theme = themes.find((theme) => theme.name === themeName);
    if (theme) {
      return deleteTheme(theme.id, store, username, pass);
    }
    console.log(
      `Trying to delete theme ${themeName} but no themes with such name were found`,
    );
  });
};

module.exports = {
  API_VERSION,
  getThemes,
  findPublishedTheme,
  deleteTheme,
  deleteThemeByName,
};
