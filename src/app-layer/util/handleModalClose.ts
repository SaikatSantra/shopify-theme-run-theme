const handleModalClose = (bodyClasses: Array<string>): void => {
  document.querySelector('body').classList.remove(...bodyClasses, 'modal-open')
  document.querySelector('html').classList.remove('modal-open')
}

export default handleModalClose