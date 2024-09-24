import React, { useEffect, useRef, useState } from 'react';
import CartLineItem from './CartLineItem';
import GiftProduct from './GiftProduct';
import { useCart } from '../../../hooks/useCart';
import getRoute from '../../../../scripts/utils/getRoute';

import LoadingIcon from './Loading';
import Money from '../../Money';

import { Interweave } from 'interweave';
import useLangStrings from '../../../hooks/useLangStrings';
import { CartUpsells } from '../CartUpsells/CartUpsells';
import PromoBar from '../PromoBar/PromoBar';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Autoplay } from 'swiper/modules';
import { SwiperSlide, Swiper } from 'swiper/react';
import GiftWithPurchaseProduct from './GiftWithPurchaseProduct';

interface Props {
  dataSet: DOMStringMap;
}

const MiniCart: React.FunctionComponent<Props> = ({ dataSet }: Props) => {
  const {
    closeMinicart,
    cart,
    items,
    updating,
    minicartOpen,
    updateNote,
    updateCartAttributes,
  } = useCart();
  const {
    title,
    summaryTitle,
    removeText,
    // lastItemText, commented out as we never use it, needs to be passed to CartLineItem.tsx
    orderTitle,
    itemsText,
    savingTitle,
    subTotalTitle,
    proccedCta,
    viewCartCta,
    additionalMinicartHTML,
    giftProductTitle,
    giftProductModalTitle,
    giftProductMessage,
    addToCartText,
    giftProductDropdown,
    // upsellTitle,
    addText,
    emptyText,
    deliveryInformation,
    shopNow,
    giftWithPurchaseTitle,
    noteTitle,
    notePlaceholder,
    noteSupportText,
    // noteBtnText,
    giftMessageTitle,
    giftMessagePlaceholder,
    giftMessageSupportText,
    // giftMessageBtnText
  } = useLangStrings(dataSet.langStrings);

  const [showCartUpsell, setShowCartUpsell] = React.useState<boolean>(true);
  useEffect(() => {
    if (items) {
      items.forEach((item) => {
        if (item.properties?._giftWithPurchaseHandle) {
          setShowCartUpsell(false);
        }
      });
    }
  }, [items]);

  const closeButton = useRef(null as HTMLButtonElement);
  useEffect(() => {
    if (minicartOpen) {
      closeButton.current.focus();
    }
  }, [minicartOpen]);

  const cartTotal = Number.parseFloat(String(cart.total_price));
  const cartItems = items.length ? true : false;
  const [isDeliveryInfoOpen, setIsDeliveryInfoOpen] = useState(false);
  const [isOrderNoteOpen, setIsOrderNoteOpen] = useState(false);
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const [isGiftMessageOpen, setIsGiftMessageOpen] = useState(false);
  const giftMessageInput = useRef<HTMLTextAreaElement>(null);

  const [enableCheckout, setEnableCheckout] = useState(true);

  let messageBlocks;
  if (dataSet.messageBlocks) {
    messageBlocks = JSON.parse(dataSet.messageBlocks);
  }

  let shippingRows;
  if (dataSet.shippingRows) {
    shippingRows = JSON.parse(dataSet.shippingRows);
  }

  let shippingLink;
  if (dataSet.shippingLink) {
    shippingLink = JSON.parse(dataSet.shippingLink);
  }

  return (
    <>
      <button
        tabIndex={-1}
        onClick={closeMinicart}
        aria-label="Close"
        className="minicart__underlay"
      ></button>
      <aside className="minicart">
        {messageBlocks.length > 1 && (
          <div className="rotating-text-bar">
            <Swiper
              modules={[Autoplay]}
              threshold={50}
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
            >
              {messageBlocks.length > 0 &&
                messageBlocks.map((message, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <p className="label label--sm">{message.title}</p>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        )}
        <header className="minicart__header">
          <div className="minicart__title-wrap">
            <h4 className="minicart__title heading-2">
              {title} {updating ? <LoadingIcon /> : ''}
            </h4>
            <p className="paragraph--md">{`${cart.item_count} ${cart.item_count === 1 ? 'Item' : 'Items'}`}</p>
          </div>
          <button
            ref={closeButton}
            tabIndex={-1}
            className="minicart__close-button"
            aria-label="Close"
            onClick={closeMinicart}
          ></button>
        </header>

        <div className="minicart__scroll-area">
          <PromoBar dataSet={dataSet} cartTotal={cartTotal} />

          {shippingRows.length > 0 && (
            <div
              className={`delivery-info__container${isDeliveryInfoOpen ? ' delivery-info__container--open' : ''}`}
            >
              <button
                className="delivery-info__toggle"
                onClick={() => {
                  setIsDeliveryInfoOpen(!isDeliveryInfoOpen);
                }}
              >
                <p className="cta">{deliveryInformation}</p>
              </button>

              <div className="delivery-info__content">
                {shippingRows.map((row, index) => {
                  return (
                    <p className="label label--sm" key={index}>
                      <span>{row.title}</span>
                      <span>{row.price}</span>
                    </p>
                  );
                })}
                {shippingLink &&
                  shippingLink.map((link, index) => {
                    return link.link && link.text ? (
                      <p key={index}>
                        <a className="link" href={link.link}>
                          {link.text}
                        </a>
                      </p>
                    ) : null;
                  })}
              </div>
            </div>
          )}

          <div className="minicart__scroll-area-inner">
            <div
              className={
                cartItems
                  ? 'minicart__main'
                  : 'minicart__main minicart__main--empty'
              }
            >
              {cartItems ? (
                <>
                  <div className="minicart__items">
                    <ul className="minicart__items-list">
                      {items.map((lineItem) => (
                        <CartLineItem
                          langStrings={{ removeText }}
                          key={lineItem.key}
                          lineItem={lineItem}
                        ></CartLineItem>
                      ))}
                    </ul>
                  </div>
                  {showCartUpsell && (
                    <GiftWithPurchaseProduct
                      langStrings={{ giftWithPurchaseTitle }}
                    />
                  )}
                  <GiftProduct
                    langStrings={{
                      giftProductTitle,
                      giftProductModalTitle,
                      giftProductMessage,
                      addToCartText,
                      giftProductDropdown,
                      addText,
                    }}
                  ></GiftProduct>
                </>
              ) : (
                <div className="minicart__empty">
                  <div className="minicart__empty-content">
                    <p className="heading-4">{emptyText}</p>
                    <a href={`${getRoute()}collections/all`} className="cta">
                      {shopNow}
                    </a>
                  </div>
                </div>
              )}
            </div>
            {cartItems ? <CartUpsells dataSet={dataSet} /> : null}
          </div>
        </div>
        {cartItems && dataSet.cartNotes === 'true' ? (
          <div
            className={`minicart__accordion${isOrderNoteOpen ? ' minicart__accordion--open' : ''}`}
          >
            <button
              className="minicart__accordion-toggle"
              onClick={() => {
                setIsOrderNoteOpen(!isOrderNoteOpen);
              }}
            >
              {noteTitle}
            </button>

            <div className="minicart__accordion-content">
              <div className="input-wrapper">
                <textarea
                  className="text-input"
                  placeholder={notePlaceholder}
                  maxLength={parseInt(dataSet.cartNotesLength)}
                  defaultValue={cart.note}
                  ref={noteInput}
                  onChange={(e) => {
                    setEnableCheckout(false);
                    updateNote(e.target.value).then(() =>
                      setEnableCheckout(true),
                    );
                  }}
                ></textarea>
              </div>
              <p className="small">
                {noteSupportText.replace('{{ max }}', dataSet.cartNotesLength)}
              </p>
            </div>
          </div>
        ) : null}
        {cartItems && dataSet.giftMessage === 'true' ? (
          <div
            className={`minicart__accordion${isGiftMessageOpen ? ' minicart__accordion--open' : ''}`}
          >
            <button
              className="minicart__accordion-toggle"
              onClick={() => {
                setIsGiftMessageOpen(!isGiftMessageOpen);
              }}
            >
              {giftMessageTitle}
            </button>

            <div className="minicart__accordion-content">
              <div className="input-wrapper">
                <textarea
                  className="text-input"
                  placeholder={giftMessagePlaceholder}
                  maxLength={parseInt(dataSet.giftMessageLength)}
                  defaultValue={cart.attributes.GiftMessage}
                  ref={giftMessageInput}
                  onChange={(e) => {
                    setEnableCheckout(false);
                    updateCartAttributes({ GiftMessage: e.target.value }).then(
                      () => setEnableCheckout(true),
                    );
                  }}
                ></textarea>
              </div>
              <p className="small">
                {giftMessageSupportText.replace(
                  '{{ max }}',
                  dataSet.giftMessageLength,
                )}
              </p>
            </div>
          </div>
        ) : null}
        {cartItems ? (
          <footer className="minicart__summary">
            <div className="minicart__summary-title heading-3">
              {summaryTitle}
            </div>
            {cart.total_discount > 0 ? (
              <>
                <div className="minicart__footer-line">
                  <span>
                    {orderTitle} ({cart.item_count} {itemsText})
                  </span>
                  <span>
                    <Money amount={cart.original_total_price} />
                  </span>
                </div>
                <div className="minicart__footer-line">
                  <span>{savingTitle}</span>
                  <span>
                    <Money amount={cart.total_discount} />
                  </span>
                </div>
              </>
            ) : null}
            <div className="minicart__footer-line minicart__totals">
              <span>{subTotalTitle}</span>
              <span>
                <Money amount={cart.total_price} />
              </span>
            </div>
            <div className="minicart__ctas">
              <a
                href={`${getRoute()}checkout`}
                className={`btn btn--secondary minicart__cta ${enableCheckout ? '' : 'btn--disabled'}`}
              >
                {proccedCta}
              </a>
              <a
                href={`${getRoute()}cart`}
                className="btn btn--primary minicart__cta"
              >
                {viewCartCta}
              </a>
            </div>
            <div className="minicart__additional-text rte">
              {additionalMinicartHTML && (
                <Interweave content={additionalMinicartHTML} noWrap={true} />
              )}
            </div>
          </footer>
        ) : null}
      </aside>
    </>
  );
};
export default MiniCart;
