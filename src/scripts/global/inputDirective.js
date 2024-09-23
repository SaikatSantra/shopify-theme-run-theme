/**
 * FORM STATES
 * -----------
 * PRISTINE: The user has not modified the form control
 * DIRTY: The user has modified the form control
 * TOUCHED: The user has interacted with the form control, e.g., by clicking or focusing on it.
 * UNTOUCHED: The form control has not been interacted with by the user.
 * VALID: The form control's value meets the validation rules defined in the application.
 * INVALID: The form control's value does not meet the validation rules defined in the application.
 */

const initInputDirectives = () => {
  const forms = document.querySelectorAll('form');

  const addPristine = input => {
    input.classList.add('dir-pristine');
  };

  const addTouched = input => {
    input.classList.add('dir-touched');
    input.classList.remove('dir-pristine');
  };

  const addDirty = input => {
    input.classList.add('dir-dirty');
    input.classList.remove('dir-pristine');
  };

  const addInvalid = input => {
    input.classList.add('dir-invalid');
    input.classList.remove('dir-valid');
  };

  const addValid = input => {
    input.classList.add('dir-valid');
    input.classList.remove('dir-invalid');
  };

  const handleInput = input => {
    addPristine(input);

    input.addEventListener('focusin', () => {
      addTouched(input);
    });

    input.addEventListener('input', () => {
      addDirty(input);
    });

    input.addEventListener('focusout', () => {
      if (input.value.length === 0) {
        addInvalid(input);
      } else {
        if (input.checkValidity()) {
          addValid(input);
        } else {
          addInvalid(input);
        }
      }
    });
  };

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(handleInput);
  });
};

export default initInputDirectives;
