import { checkIfUserCanBeTracked, setTrackingConsent } from "./tracking";

const cookieWarning = async () => {
  const [userCanBeTracked, userTrackingConsent] =
    await checkIfUserCanBeTracked();
  if (!userCanBeTracked && userTrackingConsent === "no_interaction") {
    const cookieWarningElem = document.querySelector("[data-cookie-warning]");

    if (!cookieWarningElem) {
      console.error("Could not find Cookies tin! Please create one!");
      return;
    }
    cookieWarningElem.classList.remove("hide");

    document
      .querySelector("[data-cookie-warning-btn]")
      .addEventListener("click", () => {
        setTrackingConsent(true).then(() =>
          cookieWarningElem.classList.add("hide"),
        );
      });

    const rejectButton = document.querySelector(
      "[data-cookie-warning-btn-reject]",
    );
    if (rejectButton) {
      rejectButton.addEventListener("click", () => {
        setTrackingConsent(false).then(() =>
          cookieWarningElem.classList.add("hide"),
        );
      });
    }
  }
};

export default cookieWarning;
