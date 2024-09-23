import React from 'react'
import Money from './Money'
import { Interweave } from 'interweave';
import ReactDOMServer from 'react-dom/server'
interface PriceProps {
  originalPrice: number,
  finalPrice: number,
  priceVaries: boolean,
  priceMin?: number,
  priceMax?: number,
  withCurrency?: boolean //optionally use the shopify "with currency" format, eg. currency code after price
}

interface PriceVariationProps {
  priceMin: number,
  priceMax?: number
}

const PriceVariation: React.FunctionComponent<PriceVariationProps> = ({ priceMin, priceMax }) => {
  const { fromTextHtml } = window['theme'].strings
  const { fromToTextHtml } = window['theme'].strings

  if (!isNaN(priceMin) && !isNaN(priceMax)) {
    const priceMaxString = ReactDOMServer.renderToStaticMarkup(<Money amount={priceMax} ></Money>)
    const priceMinString = ReactDOMServer.renderToStaticMarkup(<Money amount={priceMin} ></Money>)
    const text = fromToTextHtml.replace('[[price_max]]', priceMaxString).replace('[[price_min]]', priceMinString)
    return <Interweave content={text} noWrap={true} />
  }
  if (!isNaN(priceMin)) {
    const priceMinString = ReactDOMServer.renderToStaticMarkup(<Money amount={priceMin} ></Money>)
    const text = fromTextHtml.replace('[[price_max]]').replace('[[price]]', priceMinString)
    return <Interweave content={text} noWrap={true} />
  }
  return null

}


const Price = ({priceVaries, originalPrice, finalPrice, priceMin, priceMax, withCurrency} : PriceProps): JSX.Element => {
  return (
    <p className="product-price">
      { priceVaries && <PriceVariation priceMin={priceMin} priceMax={priceMax} ></PriceVariation>}
      { !priceVaries && <>
        { finalPrice !== originalPrice ? <s><Money amount={originalPrice} /></s> : null}
        <span className={finalPrice !== originalPrice ? 'price-variation' : ''}>
          <Money withCurrency={withCurrency} amount={finalPrice} />
        </span>
      </>}
    </p>
  )
}


export default Price