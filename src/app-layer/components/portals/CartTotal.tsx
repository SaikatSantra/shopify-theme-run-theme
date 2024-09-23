import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/reducers';
import Money from '../Money';

const CartTotal = (): JSX.Element => {
  const cartTotalPrice = useSelector((state: RootState) => state.cart.current.original_total_price);
  return <div className="cart__total-price link"><Money amount={cartTotalPrice} /></div>
};

export default CartTotal