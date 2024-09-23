const dismissablesInit = () => {
  const items = document.querySelectorAll('[data-dismissable-item]');
  items.forEach(item => {
    const dismissers = item.querySelectorAll('[data-dismissable-dismisser]');
    dismissers.forEach(dismisser => {
      dismisser.addEventListener('click', e => {
        e.preventDefault();
        item.classList.add('hide');
      })
    })
  })
}

export default dismissablesInit;