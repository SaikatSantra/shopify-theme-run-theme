const switchStockDisplay = (options: Record<string, any>) => ((availablilityFlag: string) : void => {
  const purchasable = availablilityFlag === 'available' || availablilityFlag === 'pre-order' || availablilityFlag === 'low'
  const {stockWrapper, stockWrapperAttr, atcButton, oosAttr, inStockAttr, unavailableAttr, preOrderAttr, dummyAtcButton} = options;
  atcButton.disabled = !purchasable;
  dummyAtcButton ? dummyAtcButton.disabled = !purchasable : null;
  stockWrapper.setAttribute(stockWrapperAttr, availablilityFlag)
  const inStockLabel = document.querySelector('[data-variant-stock-display-in-stock]');
  const lowStockLabel = document.querySelector('[data-variant-stock-display-low-stock]');
  const outOfStockLabel = document.querySelector('[data-variant-stock-display-out-of-stock]');
  const preOrderNotice = document.querySelector('[data-pre-order-notice]')

  if (availablilityFlag === 'pre-order') {
    atcButton.classList.add('btn--primary-outline')
    atcButton.classList.remove('btn--primary')
    dummyAtcButton?.classList.add('btn--primary-outline')
    dummyAtcButton?.classList.remove('btn--primary')
  } else {
    atcButton.classList.add('btn--primary')
    atcButton.classList.remove('btn--primary-outline')
    dummyAtcButton?.classList.add('btn--primary')
    dummyAtcButton?.classList.remove('btn--primary-outline')
  }
  if (availablilityFlag === 'pre-order') {
    inStockLabel ? inStockLabel.classList.add('hide') : null;
    lowStockLabel ? lowStockLabel.classList.add('hide') : null;
    outOfStockLabel ? outOfStockLabel.classList.add('hide') : null;
    atcButton.innerHTML = atcButton.getAttribute(preOrderAttr)
    dummyAtcButton ? dummyAtcButton.innerHTML = dummyAtcButton.getAttribute(preOrderAttr) : null
    preOrderNotice ? preOrderNotice.classList.remove('hide') : null;
    atcButton.setAttribute('data-atc-pre-order', '')
  } else if (availablilityFlag === 'available') {
    inStockLabel ? inStockLabel.classList.remove('hide') : null;
    lowStockLabel ? lowStockLabel.classList.add('hide') : null;
    outOfStockLabel ? outOfStockLabel.classList.add('hide') : null;
    atcButton.innerHTML = atcButton.getAttribute(inStockAttr)
    dummyAtcButton ? dummyAtcButton.innerHTML = dummyAtcButton.getAttribute(inStockAttr) : null
    preOrderNotice ? preOrderNotice.classList.add('hide') : null;
    atcButton.removeAttribute('data-atc-pre-order')
  } else if( availablilityFlag === 'low') {
    inStockLabel ? inStockLabel.classList.add('hide') : null;
    lowStockLabel ? lowStockLabel.classList.remove('hide') : null;
    outOfStockLabel ? outOfStockLabel.classList.add('hide') : null;
    atcButton.innerHTML = atcButton.getAttribute(inStockAttr)
    dummyAtcButton ? dummyAtcButton.innerHTML = dummyAtcButton.getAttribute(inStockAttr) : null
    preOrderNotice ? preOrderNotice.classList.add('hide') : null;
    atcButton.removeAttribute('data-atc-pre-order')
  } else if (availablilityFlag === 'oos') {
    inStockLabel ? inStockLabel.classList.add('hide') : null;
    lowStockLabel ? lowStockLabel.classList.add('hide') : null;
    outOfStockLabel ? outOfStockLabel.classList.remove('hide') : null;
    atcButton.innerHTML = atcButton.getAttribute(oosAttr)
    dummyAtcButton ? dummyAtcButton.innerHTML = dummyAtcButton.getAttribute(oosAttr) : null
    preOrderNotice ? preOrderNotice.classList.add('hide') : null;
    atcButton.removeAttribute('data-atc-pre-order')
  } else {
    inStockLabel ? inStockLabel.classList.add('hide') : null;
    lowStockLabel ? lowStockLabel.classList.add('hide') : null;
    outOfStockLabel ? outOfStockLabel.classList.add('hide') : null;
    atcButton.innerHTML = atcButton.getAttribute(unavailableAttr);
    dummyAtcButton ? dummyAtcButton.innerHTML = dummyAtcButton.getAttribute(unavailableAttr) : null;
    preOrderNotice ? preOrderNotice.classList.add('hide') : null;
    atcButton.removeAttribute('data-atc-pre-order')
  }
})
export default switchStockDisplay
