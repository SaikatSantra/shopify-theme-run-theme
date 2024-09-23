const checkLabelFors = {
  query: (document) => {
    const labelsWithoutFors = document.querySelectorAll(
      'label:not([for]),label[for="#"],label[for=""]',
    );
    const invalidLables = [...labelsWithoutFors].filter(
      (label) => !label.querySelector("input, select, textarea"),
    );
    return invalidLables;
  },
  message: (filename, line) =>
    `No for attribute, or field within, on <label> tag found at ${filename}:${line}`,
};
module.exports = {
  checkLabelFors,
};
