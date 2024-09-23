import * as themeCart from "../../scripts/utils/themeCart";
import {
  getCartSuccess,
  addToCartFail,
  setCartActive,
  setMinicart,
  setCartUpdating,
} from "../store/actions/cart";
import { Cart } from "../util/typings";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../store/reducers";
import { dispatchToast } from "../store/actions/toast";
import { LineItem } from "../util/typings";
import CONSTANTS from "../_constants";
import assignRemainingAvailablities from "../util/assignRemainingAvailablities";
import getCartVariantsAtLimit from "../util/getCartVariantsAtLimit";

export interface ICartItem {
  id: number;
  quantity: number;
  properties?: any;
  sellingPlan?: number;
}

interface ICartUpdateByKey {
  quantity: number;
  properties?: Record<string, any>;
}

export interface ICartHook {
  cart: Cart;
  items: LineItem[];
  updating: boolean;
  minicartOpen: boolean;
  openMinicart: () => void;
  closeMinicart: () => void;
  toggleMinicart: () => void;
  getCartState: () => Promise<Cart | void>;
  setDOMHelpers: () => boolean;
  updateItem: (
    key: string,
    opts: ICartUpdateByKey,
  ) => Promise<{ newCart: Cart; possibleShortStock: boolean } | void>;
  removeItem: (key: string) => Promise<Cart | void>;
  addToCart: (
    items: ICartItem[],
    notify?: boolean,
    callback?: (cart: Cart) => void,
  ) => Promise<Cart | void>;
  clear: () => Promise<boolean>;
  getCartAttributes: () => Promise<any>;
  updateCartAttributes: (attributes: Record<string, any>) => Promise<boolean>;
  clearCartAttributes: () => Promise<boolean>;
  getNote: () => Promise<string | null>;
  updateNote: (note: string) => Promise<boolean>;
  clearNote: () => Promise<boolean>;
  getShippingRates: () => Promise<any>;
}

export const useCart = (): ICartHook => {
  const dispatch = useDispatch();

  // selectors
  const active: boolean = useSelector(
    (state: RootState) => state.cart.cartActive,
  );
  const minicartOpen: boolean = useSelector(
    (state: RootState) => state.cart.minicartOpen,
  );
  const cart: Cart = useSelector((state: RootState) => state.cart.current);
  const updating: boolean = useSelector(
    (state: RootState) => state.cart.updating,
  );
  const items = cart.items as LineItem[];

  //open minicart
  const openMinicart = () => {
    dispatch(setMinicart(true));
  };
  const closeMinicart = () => {
    dispatch(setMinicart(false));
  };
  const toggleMinicart = () => {
    const open: Cart = useSelector(
      (state: RootState) => state.cart.minicartOpen,
    );
    dispatch(setMinicart(!open));
  };

  useEffect(() => {
    document.body.classList.toggle("minicart-open", minicartOpen);
    document.body.classList.toggle("modal-open", minicartOpen);
    document.querySelector("html").classList.toggle("modal-open", minicartOpen);
  }, [minicartOpen]);

  useEffect(() => {
    if (items.length < 1) {
      closeMinicart();
    }
  }, [items]);

  // get cart
  const getCartState = async (): Promise<Cart | void> => {
    try {
      const [shopifyCartState, variantsAtLimit] = await Promise.all([
        themeCart.getState(),
        getCartVariantsAtLimit(),
      ]);
      const cartState = assignRemainingAvailablities(
        shopifyCartState,
        variantsAtLimit,
      );
      if (cartState) {
        dispatch(getCartSuccess(cartState));
        if (!active) {
          dispatch(setCartActive(true));
        }
        return cartState;
      }
      dispatch(setCartActive(false));
    } catch (e) {
      console.error(e);
      dispatch(setCartActive(false));
    }
  };

  /**
   * Adds an Item / Items to cart
   *
   * @param items the items to add to the cart
   * @param notify whether to display the minicart or not
   * @param callback completion handler
   */
  const addToCart = async (
    items: ICartItem[],
    notify = true,
    callback?: (cart: Cart) => void,
  ): Promise<Cart | void> => {
    const itemsAddedArray = [];
    const quantityArray = [];
    dispatch(setCartUpdating(true));
    for (const item of items) {
      const { id, quantity, properties, sellingPlan } = item;
      try {
        const itemAdded = await themeCart.addItem(id, {
          quantity,
          properties,
          sellingPlan,
        });
        if (itemAdded && itemAdded.id) {
          itemsAddedArray.push(itemAdded.id);
          quantityArray.push(quantity);
          //Could dispatch an event here, if used for tracking...
          //window.dispatchEvent(new CustomEvent('blubolt:add-to-cart', { detail: { value: itemAdded.price, quantity: itemAdded.quantity } }))
        }
      } catch (error) {
        //you probably want to disable adding more than available at the liquid/component level, but for other cases:
        dispatch(addToCartFail(error));
        const err = await error.json();
        dispatch(dispatchToast("error", { customMessage: err.description }));
      }
    }

    const newCart = await getCartState();
    if (!newCart) {
      return;
    }
    if (itemsAddedArray.length > 0) {
      if (notify) {
        window["blubolt"].minicart
          ? openMinicart()
          : dispatch(dispatchToast("cart", itemsAddedArray, quantityArray));
      }
      if (callback) {
        callback(newCart);
      }
    }

    dispatch(setCartUpdating(false));

    return newCart;
  };

  // Update one item
  const updateCartByKey = async (key: string, opts: ICartUpdateByKey) => {
    if (!key || !opts) {
      return console.error("A key or options are required to update the cart");
    }

    dispatch(setCartUpdating(true));
    let possibleShortStock = false;
    try {
      let checkKey = key;
      let originalKeys = [];
      if (opts.properties) {
        //if we're chagning properties, we may get a new key
        const originalCart = await getCartState();
        if (!originalCart) {
          return;
        }
        originalKeys = originalCart.items.map((cartItem) => cartItem.key);
      }
      await themeCart.updateItem(key, opts);
      const newCart = await getCartState();
      if (!newCart) {
        return;
      }
      if (opts.properties) {
        const newKeys = newCart.items.map((cartItem) => cartItem.key);
        const newKey = newKeys.find((iKey) => !originalKeys.includes(iKey));
        checkKey = newKey ? key : newKey;
      }
      const updatedItem = newCart.items.find((item) => item.key === checkKey);
      if (opts.quantity) {
        // best effort stock availability response
        if (updatedItem.quantity < opts.quantity) {
          possibleShortStock = true;
          dispatch(
            dispatchToast("error", {
              customMessage: `Cannot add more than ${updatedItem.quantity} of ${updatedItem.title}`,
            }),
          );
        }
      }
      dispatch(setCartUpdating(false));
      return { newCart, possibleShortStock };
    } catch (error) {
      console.error("Error updating cart:", error.message);
      dispatch(setCartUpdating(false));
    }
  };

  // Remove one item
  const removeByKey = async (key) => {
    dispatch(setCartUpdating(true));
    if (!key) {
      return console.error("A key is required to remove item from the cart");
    }
    try {
      await themeCart.removeItem(key);
      const newCart = await getCartState();
      dispatch(setCartUpdating(false));
      return newCart;
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      dispatch(setCartUpdating(false));
    }
  };

  // clear the items out of the cart
  const clearCart = async () => {
    try {
      await themeCart.clearItems();
      return true;
    } catch (error) {
      console.error("Error clearing cart items cart:", error.message);
      return false;
    }
  };

  const setDOMHelpers = () => {
    const themeHasMinicart = Boolean(
      document.querySelector(`[${CONSTANTS.PORTALS.MINICART}]`),
    );
    window["blubolt"].cart = {
      currentCart: cart,
      getCartState,
      addToCart,
      updateItem: updateCartByKey,
      removeItem: removeByKey,
      clear: clearCart,
    };
    if (themeHasMinicart) {
      window["blubolt"].minicart = {
        clickOpen: (e: Event) => {
          // Uncomment if you want an empty cart to redirect straight to cart page
          // if (!cart.item_count) {
          //   return true
          // }
          e.preventDefault();
          return openMinicart();
        },
        open: openMinicart,
        close: closeMinicart,
        toggle: toggleMinicart,
      };
    }
    return true;
  };

  return {
    cart,
    items,
    updating,
    minicartOpen,
    openMinicart,
    closeMinicart,
    toggleMinicart,
    getCartState,
    setDOMHelpers,
    updateItem: updateCartByKey,
    removeItem: removeByKey,
    addToCart,
    clear: clearCart,
    getCartAttributes: themeCart.getAttributes,
    updateCartAttributes: themeCart.updateAttributes,
    clearCartAttributes: themeCart.clearAttributes,
    getNote: themeCart.getNote,
    updateNote: themeCart.updateNote,
    clearNote: themeCart.clearNote,
    getShippingRates: themeCart.getShippingRates,
  };
};
