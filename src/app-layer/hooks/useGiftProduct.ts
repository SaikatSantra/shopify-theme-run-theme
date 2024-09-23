import { useEffect, useState } from 'react'

const useGiftProduct = (): string => {
  const [giftProductHandle, setGiftProductHandle] = useState<string | undefined>()

  useEffect(() => {
    const giftProductElem = <HTMLElement>document.querySelector('[data-gift-product]')
    const giftProduct = giftProductElem.dataset.giftProduct
    setGiftProductHandle(giftProduct)
  }, [giftProductHandle])

  return giftProductHandle
}

export default useGiftProduct