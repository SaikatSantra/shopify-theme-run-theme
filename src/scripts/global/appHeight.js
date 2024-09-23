// This is taken from https://medium.com/quick-code/100vh-problem-with-ios-safari-92ab23c852a8
// Due to an issue with iOS Safari not recalculating the height of the window when the address bar is showing
// it causes 100vh elements to appear to be the wrong height, the minicart is most susceptible.
// To fix this we get the height of the page and set it as a CSS variable to be used within the stylesheets

const initAppHeight = () => {
  const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
  };
  window.addEventListener('resize', appHeight);
  appHeight();
};

export default initAppHeight;
