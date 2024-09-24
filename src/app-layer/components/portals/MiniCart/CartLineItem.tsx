import React, { useEffect, useState } from 'react';
import Price from '../../Price';
import LoadingIcon from './Loading';
import { LineItem } from '../../../util/typings';
import useCartLineItem from '../../../hooks/useCartLineItem';
import getRoute from '../../../../scripts/utils/getRoute';
import getTemplateJSON from '../../../../scripts/utils/getTemplateJSON';
import Image from '../../Image';

type Props = {
  lineItem: LineItem;
  langStrings: Record<string, string>;
};

const CartLineItem: React.FunctionComponent<Props> = ({
  lineItem,
  langStrings,
}: Props) => {
  const [productMetafields, setProductMetafields] = useState(null);
  const { removeText } = langStrings;
  const {
    increment,
    changeQuantity,
    decrement,
    remove,
    removing,
    itemUpdating,
    displayQuantity,
  } = useCartLineItem(lineItem);

  const renderImage = (lineItem: LineItem) => {
    return lineItem.featured_image.url ? (
      <Image
        alt={lineItem.product_title}
        width={110}
        height={110}
        src={lineItem.featured_image.url}
        className="minicart__item-img"
      />
    ) : (
      ''
    );
  };

  useEffect(() => {
    const storeAllProductsData = async (): Promise<void> => {
      // Relevant metafields need to be setup manually within templates/product.json-data.liquid
      const data = await getTemplateJSON<any>(
        'products',
        lineItem.handle,
        'json-data',
      );
      if (data) {
        setProductMetafields(data.metafields);
      }
    };

    if (!productMetafields) storeAllProductsData();
  }, [productMetafields]);

  return (
    productMetafields && (
      <li className={`minicart__item ${removing ? 'removing' : ''}`}>
        <div className="minicart__item-image-wrap">
          <a href={`${getRoute()}products/${lineItem.handle}`}>
            {renderImage(lineItem)}
          </a>
        </div>
        <div className="minicart__item-details">
          <h5 className="minicart__item-title">
            <a href={`${getRoute()}products/${lineItem.handle}`}>
              {' '}
              {lineItem.product_title}
              {lineItem.variant_title ? ` - ${lineItem.variant_title}` : ''}
            </a>
          </h5>
          <Price
            originalPrice={lineItem.price}
            finalPrice={lineItem.final_price}
            priceVaries={false}
            withCurrency={true}
          />
          {lineItem.variant_title ? (
            <p className="minicart__item-variant">{lineItem.variant_title}</p>
          ) : null}
          {/* { lineItem.availablity_remaining && lastItemText ? null : <span className="minicart__item-last">{ lastItemText }</span> } */}
          <div className="minicart__item-actions">
            <div className="quantity-selector">
              <button
                className="quantity-selector__btn quantity-selector__btn--dec"
                disabled={itemUpdating}
                onClick={displayQuantity === 1 ? remove : decrement}
                aria-label="-"
              ></button>
              <span className="minicart__item-quantity-number">
                {itemUpdating ? <LoadingIcon /> : ''}
                <input
                  className="quantity-selector__input"
                  type="number"
                  disabled={itemUpdating}
                  value={displayQuantity}
                  onBlur={(e) =>
                    e.target.value ? null : changeQuantity(lineItem.quantity)
                  } //if blank when blured switch back to actual value
                  onChange={(e) => changeQuantity(e.target.value)}
                ></input>
              </span>
              <button
                className="quantity-selector__btn quantity-selector__btn--inc"
                disabled={itemUpdating || !lineItem.availablity_remaining}
                onClick={increment}
                aria-label="+"
              ></button>
            </div>
            <button className="minicart__item-remove" onClick={remove}>
              {removeText}
            </button>
          </div>
        </div>
      </li>
    )
  );
};

export default CartLineItem;
