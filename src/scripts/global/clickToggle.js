import { simpleListToArr } from '../utils/data';
import safeJSONParse from '../utils/safeJsonParse';

// Example:
// data-click-toggle='[{"target": "body", "add": "account-open"},{"target": "#data-area", "remove": "active"}]'
// Add this to an element, when clicked will add class "account-open" to <body>, and #data-area will have the class "active" removed

/**
 * Handles the class toggle event
 *
 * @param {HTMLElement} toggleElement
 * @param {string} dataProperty
 */
const toggle = (toggleElement, config) => {
  if (!config || !config.target) {
    return false;
  }
  const targets = document.querySelectorAll(config.target);
  if (!targets) {
    return false;
  }

  const allMethods = ['add', 'remove', 'toggle'];

  const classlistByMethod = {};
  const configKeys = Object.keys(config);
  configKeys.forEach(key => {
    if (allMethods.indexOf(key) > -1) {
      classlistByMethod[key] = simpleListToArr(config[key]);
    }
  });

  toggleElement.addEventListener('click', e => {
    // e.stopImmediatePropagation();
    if (config.specific && toggleElement !== e.target) {
      return false;
    }

    Object.keys(classlistByMethod).forEach(methodName => {
      classlistByMethod[methodName].forEach(c => {
        targets.forEach(target => target.classList[methodName](c));
      });
    });
  });
};

const setupToggle = (toggleElement, dataProperty) => {
  const configs = safeJSONParse(toggleElement.dataset[dataProperty]);

  if (Array.isArray(configs)) {
    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];

      toggle(toggleElement, config);
    }
  } else {
    toggle(toggleElement, configs);
  }
};

/**
 * Attaches the toggle event to all elements with the data-click-toggle data-property
 */
const clickToggle = () => {
  const toggles = document.querySelectorAll('[data-click-toggle]');
  if (!toggles) {
    return false;
  }
  toggles.forEach(toggleElement => setupToggle(toggleElement, 'clickToggle'));
};

export { clickToggle, toggle };
