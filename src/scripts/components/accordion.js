/* eslint-disable no-use-before-define */
import safeJSONParse from "../utils/safeJsonParse";

const initAccordion = () => {
  const accordions = document.querySelectorAll("[data-accordion]");

  if (accordions.length === 0) return;

  const CONTENT_PADDING_BOTTOM = 16;
  const headerHeight = document.querySelector("header.header").offsetHeight;

  accordions.forEach((accordion) => {
    const config = accordion.dataset.accordionConfig
      ? safeJSONParse(accordion.dataset.accordionConfig, false)
      : {};
    !config ? console.error("Error in Accordion JSON") : null;
    const toggles = accordion.querySelectorAll("[data-accordion-toggle]");

    const onCloseAccordion = (toggle) => {
      toggle.classList.remove("accordion__title--open");
      const toggleContent = toggle.nextElementSibling;
      toggleContent.style.setProperty("--max-height", "0");
      toggleContent.style.setProperty("--padding", "0");
      toggleContent.classList.remove("accordion__content--open");
      toggle.removeEventListener("click", closeAccordion);
      toggle.removeEventListener("keydown", closeAccordion);
      toggle.addEventListener("click", openAccordion);
      toggle.addEventListener("keydown", openAccordion);
    };

    function openAccordion(e) {
      if (e.type === "click" || e.key === "Enter") {
        config.closeAllOnOpen
          ? toggles.forEach((toggle) => onCloseAccordion(toggle))
          : null;

        const content = e.target.nextElementSibling;
        const contentHeight = content.scrollHeight;
        e.target.classList.add("accordion__title--open");
        content.style.setProperty(
          "--max-height",
          `${contentHeight + CONTENT_PADDING_BOTTOM}px`,
        );
        content.style.setProperty(
          "--padding",
          `0 0 ${CONTENT_PADDING_BOTTOM}px`,
        );
        content.classList.add("accordion__content--open");
        window.scrollTo({
          top: e.target.offsetTop - headerHeight,
          left: 0,
          behavior: "smooth",
        });

        e.target.removeEventListener("click", openAccordion);
        e.target.removeEventListener("keydown", openAccordion);
        e.target.addEventListener("click", closeAccordion);
        e.target.addEventListener("keydown", closeAccordion);
      }
    }

    function closeAccordion(e) {
      e.type === "click" || e.key === "Enter"
        ? onCloseAccordion(e.target)
        : null;
    }

    if (config.mobileOnly === true) {
      accordion.classList.add("accordion--mobile-only");
    }

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", openAccordion);
      toggle.addEventListener("keydown", openAccordion);
    });
  });
};

export default initAccordion;
