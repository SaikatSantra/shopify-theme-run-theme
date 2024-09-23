import Cookies from "js-cookie";

const initNewsletterPop = () => {
  const newsletterPopup = document.querySelector("[data-newsletter-popup]");
  const cookieName = `${window["theme"].shopName}NewsletterPopup`;
  const newsletterCookie = Cookies.get(cookieName);
  if (!newsletterPopup || newsletterCookie) return;

  const newsletterPopupDelay = newsletterPopup.dataset.newsletterDelay;
  const newsletterPopupExpiry = parseInt(
    newsletterPopup.dataset.newsletterExpiration,
  );

  const showPopup = () => {
    newsletterPopup.classList.remove("hide");
    Cookies.set(cookieName, "1", { expires: newsletterPopupExpiry });
  };

  setTimeout(showPopup, newsletterPopupDelay);
};

export default initNewsletterPop;
