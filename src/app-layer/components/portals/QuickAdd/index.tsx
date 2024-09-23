import React from "react";
import { useQuickAdd } from "../../../hooks/useQuickAdd";
import { useCart } from "../../../hooks/useCart";
import Options from "./Options";
import Price from "../../Price";
import useLangStrings from "../../../hooks/useLangStrings";
import getRoute from "../../../../scripts/utils/getRoute";
import Image from "../../Image";

interface Props {
  dataSet: any;
}

const QuickAdd: React.FunctionComponent<Props> = ({ dataSet }: Props) => {
  const { addToCart } = useCart();
  const {
    product,
    setHandle,
    setSelectedOptions,
    selectedOptions,
    currentVariant,
    stockMap,
  } = useQuickAdd();
  const {
    lowStockText,
    inStockText,
    oosText,
    fullDetailsCta,
    title,
    atcText,
    pleaseSelectText,
  } = useLangStrings(dataSet.langStrings);

  if (!product) {
    return <></>;
  }

  const inStock = Boolean(currentVariant && currentVariant.available);
  const lowStock = Boolean(
    currentVariant &&
      stockMap &&
      stockMap[currentVariant.id.toString()] &&
      stockMap[currentVariant.id.toString()]["availability"] === "low",
  );
  // const preOrder = Boolean(currentVariant && stockMap && stockMap[currentVariant.id.toString()] && stockMap[currentVariant.id.toString()]['availability'] === 'pre-order');
  const close = () => setHandle(null);

  const optionsRemaining = product.options.filter(
    (option, index) => option && !selectedOptions[index],
  );

  const singleOptionRemaining =
    optionsRemaining.length === 1 ? optionsRemaining[0].name : "";

  const pleaseSelectTextReplaced = pleaseSelectText
    ? pleaseSelectText.replace("{{ option_name }}", singleOptionRemaining)
    : "";

  const actText = currentVariant
    ? currentVariant.available
      ? atcText
      : oosText
    : pleaseSelectTextReplaced;

  // Product pricing
  const productPrice = currentVariant ? currentVariant.price : product.price;
  const productOriginalPrice = currentVariant
    ? currentVariant.compare_at_price
      ? currentVariant.compare_at_price
      : currentVariant.price
    : product.compare_at_price
      ? product.compare_at_price
      : product.price;
  const productPriceVaries = currentVariant
    ? false
    : Boolean(product.price_varies);
  const productPriceMin = currentVariant
    ? currentVariant.price
    : product.min_price
      ? product.min_price
      : product.price;

  return (
    <div className="quick-add__popup-wrap">
      <button
        tabIndex={-1}
        className="quick-add__underlay"
        aria-label="close"
        onClick={close}
      ></button>
      <aside className="quick-add__popup">
        <header className="quick-add__header">
          <h3>{title}</h3>
          <button className="quick-add__close" type="button" onClick={close}>
            <span className="visually-hidden">Close</span>
          </button>
        </header>
        <main className="quick-add__main">
          <div className="quick-add__image">
            <Image
              alt={product.title}
              width={182}
              height={182}
              src={product.featured_image}
            />
          </div>
          <div className="quick-add__info">
            <h4 className="quick-add__title"> {product.title}</h4>
            <Price
              finalPrice={productPrice}
              originalPrice={productOriginalPrice}
              priceVaries={productPriceVaries}
              priceMin={productPriceMin}
            />
            <Options
              selectedOptions={selectedOptions}
              product={product}
              stockMap={stockMap}
              onChange={setSelectedOptions}
            ></Options>
            {/*
              // The below uses the same classes as product-variant-options.liquid
              // so all styling stays in the same place
            */}
            <div className="variant-option__stock-display">
              {!currentVariant ? (
                <span className="label variant-option__stock">
                  {pleaseSelectTextReplaced}
                </span>
              ) : (
                ""
              )}
              {inStock && !lowStock ? (
                <span className="label variant-option__stock variant-option__stock--in-stock">
                  {inStockText}
                </span>
              ) : (
                ""
              )}
              {lowStock ? (
                <span className="label variant-option__stock variant-option__stock--low-stock">
                  {lowStockText}
                </span>
              ) : (
                ""
              )}
              {currentVariant && !inStock ? (
                <span className="label variant-option__stock variant-option__stock--out-of-stock">
                  {oosText}
                </span>
              ) : (
                ""
              )}
              {/* <span className="label variant-option__stock variant-option__stock--out-of-stock">{unavailableText}</span> */}
            </div>
            <button
              className="btn btn--primary btn--atc btn--block"
              type="button"
              disabled={!(currentVariant && currentVariant.available)}
              onClick={() =>
                addToCart(
                  [
                    {
                      id: currentVariant.id,
                      quantity: 1,
                    },
                  ],
                  true,
                  close,
                )
              }
            >
              {actText}
            </button>
            <div className="quick-add__full-details-wrap">
              <a
                className="cta"
                href={`${getRoute()}products/${product.handle}`}
              >
                {fullDetailsCta}
              </a>
            </div>
          </div>
        </main>
      </aside>
    </div>
  );
};

export default QuickAdd;
