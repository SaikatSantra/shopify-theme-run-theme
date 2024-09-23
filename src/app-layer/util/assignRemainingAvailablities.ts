import { Cart, ICart } from "./typings";

const assignRemainingAvailablities = (
  cartState: Cart,
  variantsAtLimit: { [key: string]: number },
): ICart => ({
  ...cartState,
  items: cartState.items.map((item) => {
    const variant_id = item.variant_id.toString();
    return {
      ...item,
      availablity_remaining: !(variant_id in variantsAtLimit),
    };
  }),
});
export default assignRemainingAvailablities;
