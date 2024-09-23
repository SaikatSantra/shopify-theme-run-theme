import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/reducers';

const CartCountBadge = (): JSX.Element => {
  const cartItemCount = useSelector((state: RootState) => state.cart.current.item_count);
  return <div className="cart-count-badge">{cartItemCount}</div>
};

export default CartCountBadge