const initInputValidator = (): void => {
  const inputs = document.querySelectorAll('[data-validate-input]');

  if (!inputs) {
    return;
  }

  inputs.forEach(input => {
    const validators = [];
    const maxCharacters = input.getAttribute('data-max-chars');

    if (maxCharacters) {
      validators.push([
        // Validator
        (value) => {
          return value.length <= maxCharacters;
        },
        // Resolution
        (e) => {
          const str = e.target.value;
          e.target.value = str.substring(0, maxCharacters);
        }
      ]);
    }

    // const regex = input.getAttribute('data-regex');
    // if (regex) {
    //   validators.push((value, keyPressed) => {
    //     return (new RegExp(regex)).test(keyPressed);
    //   });
    // }

    input.addEventListener('keydown', event => {
      const ke = <KeyboardEvent>event;
      const keyPressed = String.fromCharCode(ke.which || ke.keyCode);

      const target = <HTMLInputElement>ke.target;
      const value = target.value;

      validators.forEach(([validator, resolve]) => {
        if (!validator(value, keyPressed)) {
          resolve(event);
        }
      })
    })
  });
}

export default initInputValidator;