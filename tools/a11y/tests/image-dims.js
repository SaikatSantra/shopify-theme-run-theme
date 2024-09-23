const checkImageDims = {
  query: (document) => {
    return document.querySelectorAll("img:not([width]):not([height])");
  },
  message: (filename, line) =>
    `No dimensions on <img> tag found at ${filename}:${line}`,
};
module.exports = {
  checkImageDims,
};
