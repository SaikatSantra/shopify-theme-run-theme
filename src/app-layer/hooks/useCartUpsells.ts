import { useState, useEffect } from 'react'
import { Product, LineItem } from '../util/typings'
import { useCart } from './useCart'
import safeJSONParse from '../../scripts/utils/safeJsonParse';

export const useCartUpsells = (upsellHandles: string): Product[] | null => {
  const { items } = useCart()
  const [cartUpsells, setCartUpsells] = useState(null as Product[])

  let upsells = null
  useEffect(() => {
    try {
      upsells = safeJSONParse(upsellHandles)
    } catch (error) {
      console.info({ error, data: upsellHandles })
    }
  }, [])

  useEffect(() => {
    if (!upsells) return
    const handlesInCart = (items as LineItem[]).map(item => item.handle)
    const productsNotInCart = upsells.filter(product => product.available && !handlesInCart.includes(product.handle))
    setCartUpsells(productsNotInCart)
  }, [
    items, upsells
  ])

  return cartUpsells
}