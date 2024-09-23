export const initAnnouncementBar = (): void => {
  const announcementBar = document.querySelector("[data-announcement-bar]");

  if (announcementBar === null) return;

  const closeMessageBtn = document.querySelector(
    "[data-announcement-bar-close]",
  );
  closeMessageBtn.addEventListener("click", () => {
    announcementBar.classList.add("hide");
  });
};
