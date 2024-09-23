const checkImageAlts = {
  query: (document) => {
    return document.querySelectorAll("img:not([alt])");
  },
  message: (filename, line) =>
    `No alt on <img> tag found at ${filename}:${line}`,
};
module.exports = {
  checkImageAlts,
};
