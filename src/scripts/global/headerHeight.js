const initHeaderHeight = () => {
  const searchIcon = document.querySelector('.header__icon--search .header__icon-wrapper svg');
  const searchCloseIcon = document.querySelector('.search__close svg');
  const headerGroupParent = document.querySelector('.header__group-parent');
  const announcementBar = document.querySelector('.announcement-bar');

  // Function to check if an element is in the viewport
  const isElementInViewport = el => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  let timeoutId = null;

  if (searchIcon && searchCloseIcon && headerGroupParent) {
    const setHeaderHeight = () => {
      let headerHeightValue = `${headerGroupParent.offsetHeight}px`;

      if (announcementBar && isElementInViewport(announcementBar)) {
        headerHeightValue = `${headerGroupParent.offsetHeight}px`;
      } else {
        headerHeightValue = `${parseInt(headerHeightValue, 10) - announcementBar.offsetHeight}px`;
      }

      headerGroupParent.style.setProperty('--header-height', headerHeightValue);
    };

    const handleResizeAndClick = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(setHeaderHeight, 100);
    };

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(setHeaderHeight, 100);
    };

    // Attach event listeners
    window.addEventListener('resize', handleResizeAndClick);
    searchIcon.addEventListener('click', handleResizeAndClick);
    searchCloseIcon.addEventListener('click', handleResizeAndClick);
    window.addEventListener('scroll', handleScroll);

    // Initial setup
    setHeaderHeight();
  }
};

export default initHeaderHeight;

initHeaderHeight();
