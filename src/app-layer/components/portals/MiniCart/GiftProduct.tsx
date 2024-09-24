import React, { useEffect, useState } from 'react';
import { RootState } from '../../../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import axiosGetFullProductJSON from '../../../../scripts/sections/product/axiosGetFullProductJSON';
import Price from '../../Price';
import { setMinicart } from '../../../store/actions/cart';
import { ProductVariant, Product } from '../../../util/typings';
import useGiftProduct from '../../../hooks/useGiftProduct';
import { useCart } from '../../../hooks/useCart';
import Image from '../../Image';

type Props = {
  langStrings: Record<string, string>;
};

const GiftProduct: React.FunctionComponent<Props> = ({
  langStrings,
}: Props) => {
  const {
    giftProductTitle,
    giftProductModalTitle,
    giftProductMessage,
    addToCartText,
    giftProductDropdown,
    addText,
  } = langStrings;

  const [giftProductData, setGiftProductData] = useState<Product>(null);
  const [dropdownValue, setdropdownValue] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(null);
  const [message, setMessage] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const giftProductHandle = useGiftProduct();
  const minicartOpen = useSelector(
    (state: RootState) => state.cart.minicartOpen,
  );
  const dispatch = useDispatch();
  const { addToCart } = useCart();

  const addSelectedVariant = (selectedVariantId: string) => {
    if (!giftProductData) {
      return;
    }
    const variantData =
      giftProductData.variants &&
      giftProductData.variants.find((variant) => {
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
    const getGiftProductData = async () => {
      const response = await axiosGetFullProductJSON(giftProductHandle);
      if (response) {
        setGiftProductData(response);
      }
    };
    if (giftProductHandle) {
      getGiftProductData();
    }
  }, [giftProductHandle]);

  useEffect(() => {
    setShowModal(false);
  }, [minicartOpen]);

  useEffect(() => {
    addSelectedVariant(dropdownValue);
  }, [dropdownValue]);

  return giftProductData ? (
    <div className="gift-product">
      <Image
        alt={giftProductData.title}
        width={110}
        height={110}
        src={giftProductData.images[0]}
      />
      <div className="text-container">
        <p>{giftProductTitle}</p>
        <Price
          originalPrice={giftProductData.price}
          finalPrice={giftProductData.price}
          priceVaries={false}
          withCurrency={true}
        ></Price>
      </div>
      <button
        className="btn btn--primary"
        onClick={() => setShowModal(!showModal)}
      >
        {addText}
      </button>

      {showModal ? (
        <div className="gift-product__modal">
          <div className="gift-product__inner">
            <div className="minicart-header">
              <h3 className="heading-3">{giftProductModalTitle}</h3>
              <button
                className="minicart-close-button"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="gift-product__card">
              <div className="gift-product__card-inner">
                <Image
                  alt={
                    selectedVariant && selectedVariant.featured_image.src
                      ? selectedVariant.name
                      : giftProductData.title
                  }
                  width={110}
                  height={110}
                  src={
                    selectedVariant && selectedVariant.featured_image.src
                      ? selectedVariant.featured_image.src
                      : giftProductData.images && giftProductData.images[0]
                        ? giftProductData.images[0]
                        : ''
                  }
                />
                <div className="gift-product__info">
                  <p>
                    {selectedVariant && selectedVariant.name
                      ? selectedVariant.name
                      : giftProductData.title}
                  </p>
                  <Price
                    originalPrice={
                      selectedVariant
                        ? selectedVariant.price
                        : giftProductData.price
                    }
                    finalPrice={
                      selectedVariant
                        ? selectedVariant.price
                        : giftProductData.price
                    }
                    priceVaries={false}
                    withCurrency={false}
                  ></Price>
                  <div className="select-wrapper">
                    <select
                      className="select"
                      onChange={(e) => setdropdownValue(e.target.value)}
                      value={dropdownValue}
                    >
                      <option>{giftProductDropdown}</option>
                      {giftProductData.variants.map((variant) => (
                        <option value={variant.id} key={variant.id}>
                          {variant.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <p>{giftProductMessage}</p>
              <input
                className="text-area"
                type="textarea"
                placeholder="Gift message..."
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button
              className="btn--atc btn btn--primary"
              type="button"
              disabled={disableATC(dropdownValue, selectedVariant)}
              onClick={() => {
                addToCart(
                  [
                    {
                      id: selectedVariant.id,
                      quantity: 1,
                      properties: { _giftProductMessage: message },
                    },
                  ],
                  true,
                  () => dispatch(setMinicart(false)),
                );
              }}
            >
              {addToCartText}
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  ) : null;
};

export default GiftProduct;
