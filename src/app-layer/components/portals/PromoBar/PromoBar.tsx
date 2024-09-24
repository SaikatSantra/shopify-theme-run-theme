import React from 'react';
import { formatMoney } from '../../../../scripts/utils/currency';
import { Interweave } from 'interweave';

type Props = {
  dataSet: DOMStringMap;
  cartTotal: number;
};

/**
 * Promo bar that shows how much money left is needed to get X reward
 */
const PromoBar: React.FunctionComponent<Props> = ({
  dataSet,
  cartTotal,
}: Props) => {
  const promoData = JSON.parse(dataSet.promoBarThresholds);

  if (!promoData) {
    return <></>;
  }

  const activePromoData = promoData.find(
    (data: any) => data.code === window['Shopify'].currency.active,
  );

  if (!activePromoData) {
    return <></>;
  }

  const max = activePromoData.threshold
    ? parseInt(activePromoData.threshold) * 100
    : 0;
  const currentCartTotal = cartTotal
    ? cartTotal
    : dataSet.promoBarCartValue
      ? parseInt(dataSet.promoBarCartValue)
      : 0;
  const percentageLeft = Math.min(
    Math.floor((currentCartTotal * 100) / max),
    100,
  );
  const remainingAmount = formatMoney(
    max - currentCartTotal,
    window['theme'] ? window['theme']['moneyFormat'] : '{{amount}}',
  );
  const remainingTextUpdated = dataSet.promoBarText?.replace(
    '{amount}',
    `<strong class="label--md">${remainingAmount}</strong>`,
  );
  const successText = dataSet.promoBarTextSuccess;

  return (
    <>
      {dataSet.promoBarEnable ? (
        <div className={'promo-bar'}>
          <p className="label label--sm">
            {currentCartTotal >= max ? (
              <Interweave content={successText} noWrap={true} />
            ) : (
              <Interweave content={remainingTextUpdated} noWrap={true} />
            )}
          </p>
          <div className="promo-bar__progress">
            <div
              className={`promo-bar__progress-inner ${currentCartTotal >= max ? 'promo-bar__progress-inner--success' : ''}`}
              style={{ '--width': `${percentageLeft}%` } as React.CSSProperties}
            ></div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default PromoBar;
