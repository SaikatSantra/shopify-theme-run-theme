import { findAncestor } from "../../utils/dom";

const navBreakPoint = 768; // match from liquid variable pls

export const clickOrHoverToOpenMegaNav = (navType: "click" | "hover"): void => {
  const navToggles = document.querySelectorAll(
    "[data-nav-toggle]",
  ) as NodeListOf<HTMLElement>;
  if (navToggles.length <= 0) return;

  const classToToggle = "navigation__item--open";

  const closeAllMeganavs = () =>
    document
      .querySelectorAll("[data-nav-item]")
      .forEach((t) => t.classList.remove(classToToggle));

  const openNav = (navItem: HTMLElement): void => {
    closeAllMeganavs();
    // overlay
    navItem.classList.add(classToToggle);
    document.querySelector("body").classList.add("modal-visible");
    document.querySelector("body").classList.add("modal-menu");
  };

  const closeNav = (navItem: HTMLElement): void => {
    navItem.classList.remove(classToToggle);
    document.querySelector("body").classList.remove("modal-visible");
    document.querySelector("body").classList.remove("modal-menu");
  };

  let timer: ReturnType<typeof setTimeout>;
  navToggles.forEach((navToggle) => {
    const parent = findAncestor(navToggle, "navItem");

    //clicky type always on mobile
    navToggle.addEventListener("click", () => {
      if (!parent) return;
      if (window.innerWidth >= navBreakPoint && navType === "hover") return; //if on desktop nav and hover type
      const open = !parent.classList.contains(classToToggle);
      if (open) {
        openNav(parent);
      } else {
        closeNav(parent);
      }
    });

    //if hover type
    if (navType === "hover") {
      navToggle.addEventListener("mouseenter", () => {
        if (window.innerWidth < navBreakPoint) return;
        clearTimeout(timer);
        openNav(parent);
      });
      parent.addEventListener("mouseenter", () => {
        if (window.innerWidth < navBreakPoint) return;
        clearTimeout(timer);
      });
      parent.addEventListener("mouseleave", () => {
        if (window.innerWidth < navBreakPoint) return;
        timer = setTimeout(() => {
          closeNav(parent);
        }, 300);
      });
    }

    //Always keyboard accesible
    navToggle.addEventListener("keyup", (event) => {
      if (event.key !== "Enter") return;
      openNav(parent);
    });
    parent.addEventListener("keyup", (event) => {
      if (event.key !== "Escape") return;
      closeNav(parent);
      navToggle.focus();
    });
  });

  document
    .querySelector("[data-modal-underlay]")
    .addEventListener("click", () => {
      // Closing all mega navs
      closeAllMeganavs();
    });

  document.querySelectorAll("[data-nav-btn-back]").forEach((btn) =>
    btn.addEventListener("click", () => {
      // Closing all mega navs
      closeAllMeganavs();
    }),
  );
};
