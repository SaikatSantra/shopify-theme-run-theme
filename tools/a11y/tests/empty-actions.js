const checkForEmptyActions = {
  query: (document) => { 
    const actions = document.querySelectorAll('button, a')
    const actionsWithNoText = [...actions].filter(action =>
      !action.textContent.trim()
      && !action.getAttribute('aria-label')
      && !action.querySelector('img[alt]')
    );
    return actionsWithNoText
  },
  message: (filename, line) => `No readable text on <button> or <a> tag found at ${filename}:${line}`
}
module.exports = {
  checkForEmptyActions
}

