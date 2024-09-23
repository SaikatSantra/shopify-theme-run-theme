import axios from 'axios';
import getRoute from '../../utils/getRoute';

const recoverHash = 'recover'

/**
 * Attaches the toggle to display the forgot password form
 */
export const toggleForgotPassword = (): void => {
  const toggles = document.querySelectorAll('[data-recover-toggle]');
  if (toggles.length === 0) return;

  const classToToggle = 'hide';

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      window.location.hash === `#${recoverHash}` ? window.location.hash = '' : window.location.hash = recoverHash;
      e.preventDefault();
      document.querySelector('[data-recover-form]').classList.toggle(classToToggle);
      document.querySelectorAll('[data-login-form]').forEach(element => element.classList.toggle(classToToggle));
    });
  })
}

/**
 * Checks URL and shows Recover form if URL has #recover in
 */
export const initDisplayForgotPasswordPage = (): void => {
  const toggles = document.querySelectorAll('[data-recover-toggle]');
  if (toggles.length === 0) return;

  if (window.location.hash === `#${recoverHash}`) {
    document.querySelector('[data-recover-form]').classList.remove('hide');
    document.querySelectorAll('[data-login-form]').forEach(element => element.classList.add('hide'));
  }
}

/**
 * Logs a user out and redirects them to the recover password page
 */
export const initChangePassword = (): void => {
  const toggles = document.querySelectorAll('[data-change-password]');
  if (!toggles.length) return;

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      axios.get(`${getRoute()}account/logout`)
        .then(() => window.location.href = `${getRoute()}account/login/#${recoverHash}`)
        .catch((e) => console.error(e));
    });
  })
}