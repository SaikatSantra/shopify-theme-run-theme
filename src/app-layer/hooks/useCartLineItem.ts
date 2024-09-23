import { useState, useEffect } from 'react'
import { useCart } from './useCart';
import {LineItem} from '../util/typings'
import { useDebounce } from 'use-debounce';

const useCartLineItem = (lineItem: LineItem) : Record<string,any> => {

  const { updateItem, updating } = useCart()

  const [itemUpdating, setItemUpdating] = useState(false)

  const [itemRemoving, setItemRemoving] = useState(false)

  const [pendingQuantity, setPendingQuantity] = useState(lineItem.quantity)

  const [debouncedQuantity] = useDebounce(pendingQuantity, 500)

  const safelySetPendingQuantity = (value: any) => !isNaN(value) && Number.isInteger(value) && value > 0 ? setPendingQuantity(value) : setPendingQuantity(0) // positive integer, set to that, otherwise 0

  const increment = () => safelySetPendingQuantity(pendingQuantity + 1) //increment item by 1
  const decrement = () => safelySetPendingQuantity(pendingQuantity - 1) //decrement item by 1

  const remove = async () => {
    //remove an item from the cart
    setItemRemoving(true)
    await updateItem(lineItem.key, { quantity: 0 })
  }

  useEffect(() => {
    if (!updating) {
      //safety: if the cart isn't updating, then no items are updating or removing
      setItemUpdating(false)
      setItemRemoving(false)
      //when a cart update finishes, sync the pending quantity to the actual quantity 
      safelySetPendingQuantity(lineItem.quantity)
    }
  }, [updating])


  useEffect(() => { 
    if (!isNaN(debouncedQuantity) && debouncedQuantity !== lineItem.quantity) {
      setItemUpdating(true)
      updateItem(lineItem.key, { quantity: debouncedQuantity })
    }
  }, [debouncedQuantity])


  return {
    changeQuantity: (val: any) => safelySetPendingQuantity(parseInt(val)),
    displayQuantity: pendingQuantity > 0 ? pendingQuantity : '',
    increment,
    decrement,
    remove,
    itemUpdating,
    removing: itemRemoving,
  }
}

export default useCartLineItem