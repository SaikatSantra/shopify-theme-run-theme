export const clickToEraseSearch = (): void => {
  const els = document.querySelectorAll("[data-site-search-close-btn]");
  if (els.length <= 0) return;

  els.forEach((el) =>
    el.addEventListener("click", () => {
      const input = <HTMLInputElement>(
        el.parentElement.querySelector("[data-site-search-input]")
      );
      input.value = "";
    }),
  );

  const inputs = document.querySelectorAll("[data-site-search-input]");
  inputs.forEach((input) =>
    input.addEventListener("change", () => {
      input.parentElement
        .querySelector("[data-site-search-close-btn]")
        .classList.remove("hide");
    }),
  );
};
