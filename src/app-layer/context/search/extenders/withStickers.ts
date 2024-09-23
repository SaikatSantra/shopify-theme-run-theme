import { IExtender } from ".";
import safeJSONParse from "../../../../scripts/utils/safeJsonParse";
import { IKeyedStickers, ISticker } from "../types";

const getStickers = (): IKeyedStickers => {
  const stickerScript = document.getElementById(
    "stickerData",
  ) as HTMLScriptElement;
  const stickerDataRaw = stickerScript.textContent;
  return safeJSONParse(stickerDataRaw, {}) as IKeyedStickers;
};

const getProductStickersFromTags = (
  stickers: IKeyedStickers,
  tags: string[],
): ISticker[] => {
  if (Object.keys(stickers).length < 1) return [] as ISticker[]; // if no stickers
  if (!tags || tags.length < 1) return [] as ISticker[]; // if no tags
  return tags.flatMap((tag) => {
    if (tag.includes("sticker-")) {
      // match for the sticker tag, See product-stickers.liquid
      if (stickers[tag]) {
        return stickers[tag] as ISticker;
      }
    }
    return [] as ISticker[];
  });
};

const withStickers: IExtender = {
  init: () => {
    window["blubolt"].stickers = getStickers(); //get that data and add to window, in case this is needed outside of app layer
  },
  extendGetProductsResult: (results) => {
    const updatedProducts = results.products.map((product) => {
      const tags = [
        ...product.tags,
        ...(product.available ? [] : ["sticker-sold-out"]),
      ];
      const productStickers = getProductStickersFromTags(
        window["blubolt"].stickers,
        tags,
      );

      return {
        ...product,
        meta: {
          ...product.meta,
          stickers: productStickers,
        },
      };
    });
    return {
      ...results,
      products: updatedProducts,
    };
  },
};

export default withStickers;
