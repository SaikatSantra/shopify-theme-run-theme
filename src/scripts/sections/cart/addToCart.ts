import { formDataObjToATCObj, formDataToObj } from "../../utils/formData";

/**
 * Adds an event handler to all add to cart forms that allows us to async add items to the cart
 *
 */
const addToCartBtnInit = (): void => {
  const addToCartForms = document.querySelectorAll("[data-product-form]");

  addToCartForms.forEach((form: HTMLFormElement) => {
    form.addEventListener(
      "submit",
      (e) => {
        e.preventDefault();
        const btn = form.querySelector("[data-add-to-cart]");
        btn.classList.add("loading");

        const sellingPlanElem = document.querySelector(
          "[data-selling-plan-id]",
        ) as HTMLInputElement;

        const formData = new FormData(form);
        const data = formDataToObj(formData);
        const atcObj = formDataObjToATCObj(data);
        if (sellingPlanElem) {
          const id = parseInt(sellingPlanElem.value);
          atcObj.sellingPlan = id;
        }

        window["blubolt"].cart.addToCart([atcObj], true, () => {
          btn.classList.remove("loading");
          btn.classList.add("success");
          setTimeout(() => {
            btn.classList.remove("success");
          }, 3000);
        });
      },
      false,
    );
  });
};

export default addToCartBtnInit;
