/**
 * Adds JS handling for the quantity buttons. This allows the user to click the minus or plus buttons and increment the
 * quantity input associated with those buttons.
 *
 * Selector: [data-quantity-selector]
 */
const initQuantitySelector = (): void => {
  const selectors = document.querySelectorAll('[data-quantity-selector]');

  if (selectors.length === 0) { return; }

  selectors.forEach(selector => {
    const qtyInput: HTMLInputElement = selector.querySelector('[data-quantity-input]');
    const qtyDec: HTMLButtonElement = selector.querySelector('[data-quantity-dec]');
    const qtyInc: HTMLButtonElement = selector.querySelector('[data-quantity-inc]');

    const changeInput = (operand: string, value: number): void => {
      const operandAsInteger = parseInt(operand)
      const newValue = operandAsInteger + value

      qtyInput.value = newValue.toString();
      qtyDec.disabled = newValue === 0;
    }

    qtyInput.addEventListener('change', () => changeInput(qtyInput.value, 0));
    qtyDec.addEventListener('click', () => changeInput(qtyInput.value, -1));
    qtyInc.addEventListener('click', () => changeInput(qtyInput.value, +1));
  });
}

export default initQuantitySelector;