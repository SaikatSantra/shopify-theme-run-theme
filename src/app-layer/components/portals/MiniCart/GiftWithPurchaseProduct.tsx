import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCart } from "../../../hooks/useCart";
import { LineItem, Product, ProductVariant } from "../../../util/typings";
import { setMinicart } from "../../../store/actions/cart";
import Price from "../../Price";
import axiosGetFullProductJSON from "../../../../scripts/sections/product/axiosGetFullProductJSON";
import Image from "../../Image";
// import getTemplateJSON from '../../../../scripts/utils/getTemplateJSON';

type Props = {
  langStrings: Record<string, string>;
};

// interface ProductData {
//   product: Product;
//   metafields: any;
// }

const GiftWithPurchaseProduct: React.FunctionComponent<Props> = ({
  langStrings,
}: Props) => {
  const { giftWithPurchaseTitle } = langStrings;
  const [giftWithPurchaseProduct, setGiftWithPurchaseProduct] =
    React.useState<Product>(null);
  const [giftWithPurchaseVariant, setGiftWithPurchaseVariant] =
    React.useState<ProductVariant>(null);
  // const [giftWithPurchaseVariantPrice, setGiftWithPurchaseVariantPrice] = React.useState(null);
  const { items, addToCart } = useCart();
  const dispatch = useDispatch();

  useEffect(() => {
    // Create a couple of emtpy arrays for handles
    const handles = [];
    const upsellHandles = [];
    // Loop over each line item and push the handle, and the upsell handle
    items.forEach((item: LineItem) => {
      handles.push(item.handle);
      upsellHandles.push(item.properties?._giftWithPurchaseHandle);
    });

    // Checks if the upsell is already added to the cart
    const upsellExistsInCart = handles.some((item) =>
      upsellHandles.includes(item),
    );
    // If it is, return
    if (upsellExistsInCart) return;

    // See if we have a product that has an upsell
    const upsellParent = items.find(
      (item: LineItem) =>
        item.properties?._giftWithPurchaseHandle &&
        !handles.includes(item.properties?._giftWithPurchaseHandle),
    );

    const getUpsellProductData = async () => {
      const response = await axiosGetFullProductJSON(
        upsellParent.properties._giftWithPurchaseHandle,
      );
      if (response) {
        setGiftWithPurchaseProduct(response.product);
      }
    };

    // If we do, that the upsell product data from the handle
    if (upsellParent) {
      getUpsellProductData();
    }
  }, [items]);

  useEffect(() => {
    // Once we've got the GWP product, set the variant, and get the metafields
    if (giftWithPurchaseProduct) {
      setGiftWithPurchaseVariant(giftWithPurchaseProduct.variants[0]);

      // If we want to use a price rather than have it free, use this with the relevant metafield
      // ensure you uncomment the ProductData interface
      // getTemplateJSON<ProductData>('products', giftWithPurchaseProduct.handle, 'json-cart-upsell-data')
      //   .then((res) => {
      //     // Get the GWP product price
      //     setGiftWithPurchaseVariantPrice(res.metafields.upsell_in_cart_price)
      //   })
    }
  }, [giftWithPurchaseProduct]);

  // Return unless we have a product and varaint. To include the price add  || !giftWithPurchaseVariantPrice
  if (!giftWithPurchaseProduct || !giftWithPurchaseVariant) {
    return <></>;
  }

  return (
    <div className="minicart__gwp">
      <h2 className="subheading-2">{giftWithPurchaseTitle}</h2>
      <div className="minicart__gwp-item">
        {giftWithPurchaseProduct.image.src ? (
          <Image
            alt={giftWithPurchaseProduct.title}
            width={80}
            height={80}
            src={giftWithPurchaseProduct.image.src}
          />
        ) : (
          ""
        )}
        <div className="minicart__gwp-content">
          <div className="minicart__gwp-info">
            <h3 className="minicart__gwp-title label">
              {giftWithPurchaseProduct.title}
            </h3>
            <div className="minicart__gwp-price label label--bold">
              {/* <Price
                priceMin={giftWithPurchaseVariantPrice ? giftWithPurchaseVariantPrice : giftWithPurchaseVariant.price}
                priceMax={giftWithPurchaseVariantPrice ? giftWithPurchaseVariant.price : giftWithPurchaseVariant.compare_at_price}
                originalPrice={giftWithPurchaseVariantPrice ? giftWithPurchaseVariant.price : (giftWithPurchaseVariant.compare_at_price ? giftWithPurchaseVariant.compare_at_price : giftWithPurchaseVariant.price)}
                finalPrice={giftWithPurchaseVariantPrice ? giftWithPurchaseVariantPrice : giftWithPurchaseVariant.price}
                priceVaries={false}
                withCurrency={false}
              /> */}
              <Price
                priceMin={giftWithPurchaseVariant.price}
                priceMax={
                  giftWithPurchaseVariant.compare_at_price
                    ? giftWithPurchaseVariant.compare_at_price
                    : giftWithPurchaseVariant.price
                }
                originalPrice={
                  giftWithPurchaseVariant.compare_at_price
                    ? giftWithPurchaseVariant.compare_at_price
                    : giftWithPurchaseVariant.price
                }
                finalPrice={0}
                priceVaries={false}
                withCurrency={false}
              />
            </div>
          </div>
          <button
            className="btn btn--primary-outline"
            onClick={() => {
              addToCart(
                [
                  {
                    id: giftWithPurchaseVariant.id,
                    quantity: 1,
                    properties: {
                      // _giftWithPurchasePrice: giftWithPurchaseVariantPrice ? giftWithPurchaseVariantPrice : giftWithPurchaseVariant.price
                      _giftWithPurchasePrice: 0,
                    },
                  },
                ],
                true,
                () => dispatch(setMinicart(true)),
              );
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftWithPurchaseProduct;
