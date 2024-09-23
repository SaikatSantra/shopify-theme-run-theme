import React, { useEffect, useState } from "react";

import {
  ISearchAndFilterProduct,
  ISearchAndFilterProductImage,
} from "../../../../context/search/types";

import Price from "../../../Price";
import getRoute from "../../../../../scripts/utils/getRoute";
import getTemplateJSON from "../../../../../scripts/utils/getTemplateJSON";
import SearchProductStickers from "./SearchProductStickers";
import SearchProductSwatches from "./SearchProductSwatches";
import Image from "../../../Image";
interface ISearchResultsProductCardComponent {
  product: ISearchAndFilterProduct;
  dataSet?: DOMStringMap;
  simple?: boolean;
}

const SearchProductCard: React.FC<ISearchResultsProductCardComponent> = ({
  product,
  dataSet,
  simple,
}): JSX.Element => {
  const [productMetafields, setProductMetafields] = useState(null);
  let collMainImg: ISearchAndFilterProductImage | null = null;
  // When we're using the product card on Recently Viewed/Related Products the data comes from Shopify
  // In that case the product.images is pretty useless as it it just an array of strings
  // Here we filter the media so we only get images (not videos or 3D models)
  const productImageArray = product.media
    ? product.media.filter((media) => media.media_type === "image")
    : product.images;
  const currCollHandle = dataSet?.currCollectionHandle
    ? dataSet.currCollectionHandle
    : null;
  let mainImg: ISearchAndFilterProductImage = productImageArray[0];

  // If we have a collection handle then loop over the images
  if (currCollHandle) {
    for (let i = 0; i < productImageArray.length; i++) {
      const img: ISearchAndFilterProductImage = productImageArray[i];
      if (!img.alt) continue;
      const imgAlt: string = img.alt;
      const imgAlts = imgAlt.split(",");
      if (!currCollHandle) continue;

      const matchedHandle = imgAlts.find((alt) => alt === currCollHandle);

      if (matchedHandle) {
        collMainImg = img;
        break;
      }
    }
    if (collMainImg) mainImg = collMainImg;
  }

  const productHandle = product.handle
    ? product.handle
    : product.url.split("products/")[1];

  const productUrl = `${getRoute()}products/${productHandle}`;

  const otherImgs: ISearchAndFilterProductImage[] = productImageArray.filter(
    (img) => img.src !== mainImg.src,
  );

  useEffect(() => {
    const storeAllProductsData = async (): Promise<void> => {
      // Relevant metafields need to be setup manually within templates/product.json-data.liquid
      const data = await getTemplateJSON<any>(
        "products",
        productHandle,
        "json-data",
      );
      if (data) {
        setProductMetafields(data.metafields);
      }
    };

    if (!productMetafields) storeAllProductsData();
  }, [productMetafields]);

  return productMetafields ? (
    <div
      className={`product-card product-card--react${simple ? " product-card--simple" : ""}`}
    >
      <div className="product-card__image-container">
        <a
          href={
            dataSet.customer === "logged-in" ? productUrl : "/account/login"
          }
        >
          <div className="product-card__image">
            {productImageArray && productImageArray.length > 0 && (
              <Image
                alt={mainImg.alt ? mainImg.alt : product.name}
                width={300}
                height={300}
                src={mainImg.src}
                className="product-card__img"
              />
            )}
            {otherImgs && otherImgs.length > 0 && (
              <Image
                alt={otherImgs[0].alt ? otherImgs[0].alt : product.name}
                width={300}
                height={300}
                src={otherImgs[0].src}
                className="product-card__img img-hover"
              />
            )}
            {productMetafields &&
            productMetafields.stickers &&
            Object.values(productMetafields.stickers).length ? (
              <SearchProductStickers stickers={productMetafields.stickers} />
            ) : null}
          </div>
        </a>
      </div>
      <div className="product-card__info">
        <h3 className="product-card__title">
          <a
            href={
              dataSet.customer === "logged-in" ? productUrl : "/account/login"
            }
          >
            {product.name}
          </a>
        </h3>

        <div className="product-card__price">
          <Price
            finalPrice={
              product.priceObj ? product.priceObj.finalPrice : product.price
            }
            originalPrice={
              product.priceObj
                ? product.priceObj.originalPrice
                : product.compare_at_price
                  ? product.compare_at_price
                  : product.price_max
            }
            priceMin={
              product.priceObj ? product.priceObj.priceMin : product.price_min
            }
            priceMax={
              product.priceObj ? product.priceObj.priceMax : product.price_max
            }
            priceVaries={
              product.priceObj
                ? product.priceObj.priceMin !== product.priceObj.priceMax
                : product.price_min !== product.price_max
            }
          />
        </div>

        {productMetafields &&
        productMetafields.swatches &&
        Object.values(productMetafields.swatches).length ? (
          <SearchProductSwatches swatches={productMetafields.swatches} />
        ) : null}

        {product.available && !simple ? (
          <>
            <div className="product-card__log-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
              >
                <g clipPath="url(#clip0_5753_12395)">
                  <path
                    d="M11.0079 7.67568V4C11.0079 3.44744 10.8998 2.93093 10.6835 2.45045C10.4673 1.96997 10.179 1.54955 9.81868 1.18919C9.45831 0.828827 9.0379 0.540541 8.55742 0.324324C8.07693 0.108107 7.56042 0 7.00787 0C6.45531 0 5.9388 0.108107 5.45832 0.324324C4.97783 0.540541 4.55742 0.828827 4.19705 1.18919C3.83669 1.54955 3.54841 1.96997 3.33219 2.45045C3.11597 2.93093 3.00787 3.44744 3.00787 4V7.67568H0.845703V16H13.17V7.67568H11.0079ZM3.62048 4C3.62048 3.54354 3.71057 3.11111 3.89075 2.7027C4.07093 2.29429 4.31717 1.93394 4.62949 1.62162C4.91778 1.30931 5.27213 1.06306 5.69255 0.882883C6.11297 0.702702 6.55141 0.612613 7.00787 0.612613C7.46432 0.612613 7.90276 0.702702 8.32318 0.882883C8.7436 1.06306 9.09795 1.30931 9.38624 1.62162C9.69856 1.93394 9.9448 2.29429 10.125 2.7027C10.3052 3.11111 10.3953 3.54354 10.3953 4V7.67568H3.62048V4ZM12.5574 15.3874H1.45832V8.32432H12.5574V15.3874Z"
                    fill="#333333"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_5753_12395">
                    <rect
                      width="12.3243"
                      height="16"
                      fill="white"
                      transform="translate(0.845703)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* <div className="product-card__quick-add">
              <button data-quick-add-btn={product.handle} className="quick-add__btn btn btn--quickadd" onClick={() => window['blubolt'].quickadd.open(product.handle)}>
                {window['theme'].strings.quickAdd}
              </button>
            </div> */}
          </>
        ) : null}
        {/* <spark-product-card parent-id={product.id}></spark-product-card> */}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default SearchProductCard;
