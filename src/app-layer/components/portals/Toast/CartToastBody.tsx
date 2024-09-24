import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/reducers';
import { dismissToast } from '../../../store/actions/toast';
import Price from '../../Price';
import getRoute from '../../../../scripts/utils/getRoute';
import Image from '../../Image';

interface CartToastBodyProp {
  productIds: any;
  cartTitleText: string;
  cartButtonText: string;
  quantities: any[];
}

const CartToastBody = (props: CartToastBodyProp): JSX.Element => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.current.items);
  const { cartTitleText, productIds, cartButtonText, quantities } = props;

  let itemCount = productIds.length;
  if (quantities.length > 0) {
    itemCount = quantities.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
    );
  }
  const pluralise = itemCount > 1 ? 's' : '';

  const title = cartTitleText
    .replace('{{ item_count }}', itemCount)
    .replace('{{ pluralise }}', pluralise);
  const products = cartItems.filter(
    (cartItem) => productIds.indexOf(cartItem.id) > -1,
  );

  const renderImage = (product) => {
    return product.image ? (
      <Image
        alt={product.title}
        width={80}
        height={80}
        src={product.image}
        className="product-image"
      />
    ) : (
      ''
    );
  };

  return (
    <>
      <header className="toast__header">
        <i></i>
        <p className="toast__title">{title}</p>
        <button
          aria-label="close"
          className="btn-close"
          onClick={() => dispatch(dismissToast())}
        ></button>
      </header>
      <div className="toast__body">
        <ul className="list-products">
          {products.map((product, i) => (
            <li className="product" key={'cart-product-' + i}>
              {renderImage(product)}
              <div className="product-detail">
                <p className="title">{product.title}</p>
                <Price
                  originalPrice={product.price}
                  finalPrice={product.final_price}
                  priceVaries={false}
                />
              </div>
            </li>
          ))}
        </ul>
        <a href={`${getRoute()}cart`} className="btn btn--tertiary btn--cart">
          {cartButtonText}
        </a>
      </div>
    </>
  );
};

export default CartToastBody;
