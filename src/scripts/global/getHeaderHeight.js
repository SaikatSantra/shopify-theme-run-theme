const getHeaderHeight = () => {
  const header = document.querySelector("header.header");
  ["load", "resize"].forEach(function (e) {
    window.addEventListener(e, () => {
      window["blubolt"].headerHeight = header?.offsetHeight;
    });
  });
};

export default getHeaderHeight;
