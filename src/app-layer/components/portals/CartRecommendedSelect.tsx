import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCart } from '../../hooks/useCart';
import { setMinicart } from '../../store/actions/cart';
import { Product, ProductVariant } from '../../util/typings';

interface CartRecommendedSelectProps {
  product: Product;
}

const CartRecommendedSelect = (
  props: CartRecommendedSelectProps,
): JSX.Element => {
  const { product } = props;
  const { addToCart } = useCart();
  const dispatch = useDispatch();
  const [dropdownValue, setdropdownValue] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(null);
  const atcButton = useRef(null as HTMLButtonElement);
  const optString = `${window['theme'].strings.select} ${window['theme'].strings.cartRecsOpts}`;

  const addSelectedVariant = (selectedVariantId: string) => {
    const variantData =
      product.variants &&
      product.variants.find((variant) => {
        return variant.id === parseInt(selectedVariantId);
      });
    setSelectedVariant(variantData);
  };

  const disableATC = (
    dropdownValue: string,
    selectedVariant: ProductVariant,
  ) => {
    if (dropdownValue && selectedVariant && selectedVariant.available) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    addSelectedVariant(dropdownValue);
  }, [dropdownValue]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selector = e.target;
    const selectedOption = selector.options[e.target.selectedIndex];
    const atcBtn = atcButton.current;
    const { variantAvailable } = selectedOption.dataset;

    if (!selectedOption.value) {
      atcBtn.setAttribute('disabled', 'disabled');
    } else {
      setdropdownValue(selectedOption.value);
      atcBtn.setAttribute('data-atc-product-id', selectedOption.value);

      if (variantAvailable === 'true') {
        atcBtn.textContent = atcBtn.getAttribute('data-atc-text');
      } else {
        atcBtn.textContent = atcBtn.getAttribute('data-atc-oos-text');
      }
    }
  };

  let selectMarkUp: JSX.Element;

  if (product.variants.length > 1) {
    selectMarkUp = (
      <>
        <div className="select-wrapper">
          <label
            htmlFor={`product-options-${product.id}`}
            className="visually-hidden"
          >
            {optString}
          </label>
          <select
            data-upsell-option-selector={product.id}
            name="id"
            id={`product-options-${product.id}`}
            defaultValue={optString}
            className="select"
            onChange={(e) => handleSelectChange(e)}
          >
            <option value={optString} disabled>
              {optString}
            </option>
            {product.variants.map((variant) => {
              return (
                <option
                  key={variant['id']}
                  value={variant['id']}
                  data-variant-available={variant['available']}
                >
                  {variant['available']
                    ? variant['title']
                    : window['theme'].strings.soldOut}
                </option>
              );
            })}
          </select>
        </div>
        <button
          disabled={disableATC(dropdownValue, selectedVariant)}
          ref={atcButton}
          type="submit"
          className="btn btn--primary-outline btn--fit"
          data-aid="product-upsell-atc"
          data-add-to-cart-with-variant
          data-atc-quantity-input={`#upsell-quantity-${product['handle']}`}
          data-atc-product-id={product.id}
          data-atc-text={window['theme'].strings.addToCart}
          data-atc-oos-text={window['theme'].strings.soldOut}
          onClick={() => {
            addToCart(
              [
                {
                  id: selectedVariant.id,
                  quantity: 1,
                },
              ],
              true,
              () => dispatch(setMinicart(true)),
            );
          }}
        >
          {optString}
        </button>
      </>
    );
  } else {
    selectMarkUp = (
      <>
        <button
          disabled={!product['available']}
          type="submit"
          className="btn btn--primary-outline btn--fit"
          data-aid="product-upsell-atc"
          data-add-to-cart-with-variant
          data-atc-quantity-input={`#upsell-quantity-${product['handle']}`}
          data-atc-product-id={product.variants[0].id}
          data-atc-text={window['theme'].strings.addToCart}
          data-atc-oos-text={window['theme'].strings.soldOut}
          onClick={() => {
            addToCart(
              [
                {
                  id: product.variants[0].id,
                  quantity: 1,
                },
              ],
              true,
              () => dispatch(setMinicart(true)),
            );
          }}
        >
          {product['available']
            ? window['theme'].strings.addToCart
            : window['theme'].soldOut}
        </button>
      </>
    );
  }

  return <>{selectMarkUp}</>;
};

export default CartRecommendedSelect;
