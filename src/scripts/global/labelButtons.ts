const initLabelButtons = (): void => {
  const labelButtons = document.querySelectorAll(
    "label[for][data-label-btn]",
  ) as NodeListOf<HTMLLabelElement>;
  [...labelButtons].forEach((label) => {
    const forattr = label.getAttribute("for");
    label.addEventListener("keyup", (event) => {
      if (event.key !== "Enter") return;
      const target = document.getElementById(forattr);
      target.focus();
    });
  });
};

export default initLabelButtons;
