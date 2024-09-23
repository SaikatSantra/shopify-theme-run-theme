import axios from "axios";
import getRoute from "../../utils/getRoute";
/**
 * Redirects user when a menu option from the nav select has been pressed.
 */
export const initAccountMobileMenu = (): void => {
  const accountMenu = document.querySelector("[data-select-as-nav]");
  if (!accountMenu) return;

  accountMenu.addEventListener("change", function (e) {
    const zeAccountMenu = <HTMLSelectElement>e.target;
    const dataset = zeAccountMenu.options[zeAccountMenu.selectedIndex].dataset;
    if (dataset.changePassword) {
      axios
        .get(`${getRoute()}account/logout`)
        .then(
          () => (window.location.href = `${getRoute()}account/login/#recover`),
        )
        .catch((e) => console.error(e));
    } else {
      window.location.pathname = dataset.url;
    }
  });
};

export const initActiveMenuItem = (): void => {
  const accountMenus = document.querySelectorAll(
    "[data-account-menu]",
  ) as NodeListOf<HTMLElement>;
  const mobileAccountMenus = document.querySelectorAll(
    "[data-mobile-account-menu]",
  ) as NodeListOf<HTMLElement>;
  const mobileAccountTitles = document.querySelectorAll(
    "[data-mobile-account-title]",
  ) as NodeListOf<HTMLElement>;
  const pathName = window.location.pathname;
  const queryString = window.location.search;

  if (queryString) {
    accountMenus.forEach((menu) => {
      const menuItems = menu.querySelectorAll("li") as NodeListOf<HTMLElement>;

      menuItems.forEach((item) => {
        const menuLink = item.querySelector("a") as HTMLElement;
        const linkHref = menuLink.getAttribute("href");

        item.classList.remove("active");

        if (linkHref.includes(queryString)) {
          item.classList.add("active");
        } else {
          menuLink.hasAttribute("data-mobile-account-link")
            ? item.classList.remove("hide")
            : null;
        }
      });
    });

    mobileAccountTitles.forEach((title) => {
      const accountTitles = title.querySelectorAll(
        "span",
      ) as NodeListOf<HTMLElement>;
      accountTitles.forEach((item) => {
        const menuLink = item.querySelector("a") as HTMLElement;
        const linkHref = menuLink.getAttribute("href");
        if (linkHref.includes(queryString)) {
          item.classList.remove("hide");
        }
      });
    });
  } else {
    if (pathName.includes("/orders")) {
      accountMenus.forEach((menu) => {
        const menuItems = menu.querySelectorAll(
          "li",
        ) as NodeListOf<HTMLElement>;

        menuItems.forEach((item) => {
          const menuLink = item.querySelector("a") as HTMLElement;
          const linkHref = menuLink.getAttribute("href");

          item.classList.remove("active");

          if (linkHref.includes("orders")) {
            item.classList.add("active");
          }
        });
      });
    }

    mobileAccountMenus.forEach((menu) => {
      const menuItems = menu.querySelectorAll("li") as NodeListOf<HTMLElement>;

      menuItems.forEach((item) => {
        item.classList.remove("hide");
      });
    });

    mobileAccountTitles.forEach((title) => {
      const accountTitles = title.querySelectorAll(
        "span",
      ) as NodeListOf<HTMLElement>;
      accountTitles.forEach((item) => {
        const menuLink = item.querySelector("a") as HTMLElement;
        const linkHref = menuLink.getAttribute("href");
        if (
          linkHref === pathName ||
          (linkHref.includes("orders") &&
            window.location.href.includes("/orders"))
        ) {
          item.classList.remove("hide");
        }
      });
    });
  }
};
