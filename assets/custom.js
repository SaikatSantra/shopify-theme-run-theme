// open and close cart drawer
function HideFunction() {
  var IDminiCart = document.getElementById("mini-cart");
  var IDminiCartMask = document.getElementById("minibag_mask");
  IDminiCart.classList.remove("show-minibag");
  IDminiCart.classList.add("hide-minibag");
  // document.body.style.overflow = "auto";
  // document.querySelector(":root").style.overflow = "auto";
  IDminiCartMask.style.display = "none";
}

function ShowFuntion(IDminiCart, IDminiCartMask) {
  IDminiCart.classList.add("show-minibag");
  IDminiCart.classList.remove("hide-minibag");
  document.body.style.overflow = "hidden";
  document.querySelector(":root").style.overflow = "hidden";
  IDminiCartMask.style.display = "block";
}

// Hearder icon hover
const cartContainer = document.querySelector(".header__icon--cart");
const showView = (event) => {
  event.preventDefault();
  console.log("show");
  //mini cart section render
  fetch("/?sections=cart-items")
    .then((response) => response.json())
    .then((data) => {
      var SectionHtml = data["cart-items"];
      var IDminiCart = document.getElementById("mini-cart");
      var IDminiCartMask = document.getElementById("minibag_mask");
      IDminiCart.innerHTML = SectionHtml;
      ShowFuntion(IDminiCart, IDminiCartMask);
    });
};
cartContainer.onclick = showView;

// Item remove
function updateItemById(id, quantity, sections) {
  let formData = {
    id: id,
    quantity: quantity,
    sections: sections,
  };
  console.log(JSON.stringify(formData));
  fetch("/cart/change.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.item_count > 0) {
        document.querySelector(
          ".cart-count-bubble"
        ).innerHTML = `<span aria-hidden="true">${data.item_count}</span><span class="visually-hidden">${data.item_count} item</span>`;
      } else {
        document.querySelector(".cart-count-bubble").innerHTML = ``;
      }

      var sectionHtmlData = data;
      var SectionHtml = sectionHtmlData.sections["cart-items"];
      var IDminiCart = document.getElementById("mini-cart");
      console.log(SectionHtml);
      IDminiCart.innerHTML = SectionHtml;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Attach the event listener to a parent element that exists at page load
function updateCartDrawer() {
  // Assuming '/?sections=cart-items' is a URL that returns the necessary cart structure
  fetch("/?sections=cart-items")
    .then((response) => response.json())
    .then((data) => {
      const sectionHtml = data["cart-items"];
      const idMiniCart = document.getElementById("mini-cart");
      idMiniCart.innerHTML = sectionHtml;
      // Assuming you want to show the cart as part of the update
      ShowFunction(idMiniCart, document.getElementById("minibag_mask"));
    })
    .catch((error) => console.error("Failed to update cart drawer:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutations) => {
    if (document.querySelector(".cart-quantity-selector button")) {
      document
        .querySelectorAll(".cart-quantity-selector button")
        .forEach((button) => {
          attachEventToButton(button);
        });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  document
    .querySelectorAll(".cart-quantity-selector button")
    .forEach((button) => {
      attachEventToButton(button);
    });
});

function attachEventToButton(button) {
  if (!button.dataset.listenerAttached) {
    button.dataset.listenerAttached = "true";
    button.addEventListener("click", async () => {
      const input = button.parentElement.querySelector("input");
      const value = Number(input.value);
      const isPlus = button.classList.contains("plus");
      const key = button.closest(".min-cart-item").getAttribute("data-key");
      const newValue = isPlus ? value + 1 : value > 1 ? value - 1 : 1; // Ensure newValue is never less than 1

      input.value = newValue; // Update the input value immediately

      //  ajax update
      try {
        const res = await fetch("/cart/update.js", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updates: { [key]: newValue } }),
        });
        const json = await res.json();
        console.log(json);

        // update cart
        updateCartDrawer();
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    });
  }
}

function updateCartDrawer() {
  fetch("/?sections=cart-items")
    .then((response) => response.json())
    .then((data) => {
      const sectionHtml = data["cart-items"];
      const idMiniCart = document.getElementById("mini-cart");
      const idMiniCartMask = document.getElementById("minibag_mask");
      if (idMiniCart) {
        idMiniCart.innerHTML = sectionHtml;
      }
      if (idMiniCartMask) {
        ShowFunction(idMiniCart, idMiniCartMask);
      }
    })
    .catch((error) => console.error("Failed to update cart drawer:", error));
}

// function productGallerySliderInitialise() {
//   $(".mainSlider:not(.slick-initialized)").slick({
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//     fade: true,
//     asNavFor: ".thumbSlider",
//     prevArrow:
//       '<div class="slick-prev pull-left"><button type="button" class="slider-button slider-button--prev slick-btns" name="previous" aria-label="TODO"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path></svg></button></div>',
//     nextArrow:
//       '<div class="slick-next pull-right"><button type="button" class="slider-button slider-button--next slick-btns" name="next" aria-label="TODO"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path></svg></button></div>',
//     responsive: [
//       {
//         breakpoint: 990,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           dots: false,
//         },
//       },
//     ],
//   });

//   if($('.thumbSlider .slide_item').length > 2 || window.innerWidth > 990 ){
//     $(".thumbSlider:not(.slick-initialized)").slick({
//       slidesToShow: 8,
//       slidesToScroll: 1,
//       asNavFor: ".mainSlider",
//       dots: true,
//       focusOnSelect: true,
//       vertical: true,
//       responsive: [
//         {
//           breakpoint: 990,
//           settings: {
//             slidesToShow: 5,
//             slidesToScroll: 1,
//             dots: true,
//             vertical: false,
//           },
//         },
//       ],
//     });
//   }
//   else {
//     $('.thumbSlider').addClass('hidden');
//   }

// }

// jQuery(function ($) {
//   console.log("work");
// $(".thumbnail-slider .thumbnail-list .thumbnail-list__item").click(
//   function () {
//     var temp_id = $(this).data("target");
//     $(this).find("button.thumbnail").attr("aria-current", "true");
//     $(this)
//       .siblings(".thumbnail-list__item")
//       .find("button.thumbnail")
//       .removeAttr("aria-current");

//     $(
//       ".slider-mobile-thumbnail .product__media-list .product__media-item"
//     ).each(function () {
//       var target_id = $(this).data("media-id");

//       if (temp_id == target_id) {
//         $(this).addClass("is-active");
//         $(this).siblings(".product__media-item").removeClass("is-active");
//       }
//     });
//   }
// );

// productGallerySliderInitialise();

// $(document).ready(function () {
// $("#points").change(function () {
//   var range_val = $(this).val();
//   //alert(range_val);
//   $(".field__input--max").val(range_val);
//   $(".field__input--min").val(0);
// });
// $(".slider-button").click(function () {
//   if ($(this).hasClass("slider-button--prev")) {
//     $(".slider-mobile-gutter ul.slider--mobile li.is-active")
//       .prev()
//       .addClass("added");
//     $(".slider-mobile-gutter ul.slider--mobile li.is-active").removeClass(
//       "is-active"
//     );
//     $(".slider-mobile-gutter ul.slider--mobile li.added").addClass(
//       "is-active"
//     );
//     $(".slider-mobile-gutter ul.slider--mobile li.added").removeClass(
//       "added"
//     );
//   }
//   if ($(this).hasClass("slider-button--next")) {
//     $(".slider-mobile-gutter ul.slider--mobile li.is-active")
//       .next()
//       .addClass("added");
//     $(".slider-mobile-gutter ul.slider--mobile li.is-active").removeClass(
//       "is-active"
//     );
//     $(".slider-mobile-gutter ul.slider--mobile li.added").addClass(
//       "is-active"
//     );
//     $(".slider-mobile-gutter ul.slider--mobile li.added").removeClass(
//       "added"
//     );
//   }
// });

/*  Added by Divy Start   */

// Menu click event when we select logo position to top center
// $(".header--top-center .modal__toggle").on("click", function () {
//   $(".header--top-center .header__inline-menu").hide();

//   if (screen.width > 767) {
//     $(".header.header--top-center .search.search-modal__form").css({
//       "margin-top": "50px",
//     });
//     $(".header.header--top-center .modal__close-button").css({
//       "margin-top": "50px",
//     });
//   } else {
//     $(".header__heading").hide();
//     $(".header__icon--cart").hide();
//   }
// });

//           Modal Close event Click in header
// $(".header--top-center .modal__close-button").on("click", function () {
//   if (screen.width < 767) {
//     $(".header__heading").show();
//     $(".header__icon--cart").show();
//   } else {
//     $(".header__inline-menu").show();
//   }
// });
// /*  Added by Divy End   */

// $(".mobile-facets__close").click(function () {
//   $(".mobile-facets__close").addClass("d-none");
// });
// $(".close-js-wishlist").click(function () {
//   $(".wishlist-pop").removeClass("active");
// });

// $(".mobile-facets__open").click(function () {
//   $(".mobile-facets__close").removeClass("d-none");
// });

// $('.header__icon').click(function()
// {
//   if(!$('.menu-drawer-container').hasClass('menu-opening'))
//   {
//   	$('.menu-drawer-container').addClass('menu-opening')
//   }
// });
// });
// });
