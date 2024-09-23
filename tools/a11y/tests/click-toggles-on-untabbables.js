const checkForUntabbableClickToggles = {
  query: (document) => {
    const invalidClickToggles = document.querySelectorAll(
      '[data-click-toggle]:not(button):not(input):not(a):not([tabindex][role="button"])',
    );
    return invalidClickToggles;
  },
  message: (filename, line) =>
    `Possibly unfocussable data-click-toggle found at ${filename}:${line}`,
};
module.exports = {
  checkForUntabbableClickToggles,
};
