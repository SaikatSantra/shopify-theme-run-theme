import { ICartItem } from "../../app-layer/hooks/useCart";

export const formDataToObj = (
  formData: FormData,
): Record<string, string | Record<string, string>> => {
  return [...formData.entries()].reduce((acca, [key, value]) => {
    if (value === "") {
      return acca;
    }
    if (key.includes("[") && key.slice(-1) === "]") {
      // we have nested props
      const [k1, k2] = key.replace("]", "").split("[");
      const innerObj = acca[k1]
        ? {
            ...acca[k1],
            [k2]: value,
          }
        : {
            [k2]: value,
          };
      return {
        ...acca,
        [k1]: innerObj,
      };
    }
    return {
      ...acca,
      [key]: value,
    };
  }, {});
};

export const formDataObjToATCObj = (
  obj: Record<string, string | Record<string, string>>,
): ICartItem => {
  const { id, quantity, properties } = obj;
  if (!id || typeof id !== "string") {
    throw new Error("No id set");
  }
  const variantId = parseInt(id);
  if (isNaN(variantId)) {
    throw new Error("ID field is not a number");
  }
  return {
    id: variantId,
    quantity: quantity && typeof quantity === "string" ? parseInt(quantity) : 1,
    properties: properties ? properties : {},
  };
};
