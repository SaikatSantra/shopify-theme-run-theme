/**
 * Attaches an event listener to copy elements. Once clicked, the URL will be added to a hidden textbox which will be
 * used to copy the contents.
 */
const initCopyUrl = (): void => {
  const items = document.querySelectorAll("[data-copy-url]");
  if (items.length <= 0) return;

  let timer = 0;
  items.forEach((item: HTMLElement) =>
    item.addEventListener("click", () => {
      clearTimeout(timer);
      navigator.clipboard.writeText(window.location.href);
      item.classList.add("share-icon--copied");
      timer = window.setTimeout(
        () => item.classList.remove("share-icon--copied"),
        1800,
      );
    }),
  );
};

export default initCopyUrl;
