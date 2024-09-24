if (!customElements.get("product-form")) {
  class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector("form");
      this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
      this.cartNotification = document.querySelector("cart-notification");
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      this.cartNotification.setActiveElement(document.activeElement);

      const submitButton = this.querySelector('[type="submit"]');

      submitButton.setAttribute("disabled", true);
      submitButton.classList.add("loading");

      const config = fetchConfig("javascript");
      config.headers["X-Requested-With"] = "XMLHttpRequest";
      delete config.headers["Content-Type"];

      const formData = new FormData(this.form);

      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((parsedState) => {
          //mini cart section render
          fetch("/?sections=cart-items")
            .then((response) => response.json())
            .then((data) => {
              var SectionHtml = data["cart-items"];
              var IDminiCart = document.getElementById("mini-cart");
              var IDminiCartMask = document.getElementById("minibag_mask");
              IDminiCart.innerHTML = SectionHtml;
              IDminiCart.classList.add("show-minibag");
              IDminiCart.classList.remove("hide-minibag");
              IDminiCartMask.style.display = "block";
            });
          fetch("/cart.js")
            .then((response) => response.json())
            .then((cart) => {
              document.getElementById("CartCount").innerHTML = cart.item_count;
            });
        })

        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          submitButton.classList.remove("loading");
          submitButton.removeAttribute("disabled");
        });
    }
  }
  customElements.define("product-form", ProductForm);
}

// Added by Divy Start
// Btn Plus Click event to prevent click for more than available quantity

// $(".btn-plus").on("click", function () {
//   var osQty = $("#qty_inventory_track").html();
//   var qtyInput = $(".quantity__input").val();

//   if ($("#qty_inventory_track").length == 0) {
//     var osQty = $(".inventory-container p strong").html();
//   }

//   if ($(".inventory-container").hasClass("out-of-stock")) {
//     $(".quantity__input").val(1);
//     return false;
//   }

//   if (qtyInput > parseInt(osQty)) {
//     $(".quantity__input").val(osQty);
//     return false;
//   }
// });
// Added by Divy End
