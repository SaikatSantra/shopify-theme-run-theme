import { Cart, LineItem } from "../../util/typings";

interface IFReduxCart {
  cartActive: boolean;
  minicartOpen: boolean;
  current: Cart;
  updating: boolean;
  lastAdded?: LineItem;
}

const cart: Cart = {
  token: "",
  note: "",
  attributes: {},
  total_price: 0,
  total_weight: 0,
  total_discount: 0,
  original_total_price: 0,
  item_count: 0,
  requires_shipping: true,
  currency: "",
  items: [],
};

const cartInitialState: IFReduxCart = {
  cartActive: false,
  minicartOpen: false,
  current: cart,
  updating: false,
  lastAdded: null,
};

export default cartInitialState;
