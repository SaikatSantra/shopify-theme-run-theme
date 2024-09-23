import React, { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Product } from "../../../util/typings";
import Price from "../../Price";
import CartRecommendedSelect from "../CartRecommendedSelect";
import axios from "axios";
import { useCart } from "../../../hooks/useCart";
import useLangStrings from "../../../hooks/useLangStrings";
import Image from "../../Image";

// Can be disabled in theme Settings > Cart > Show Shopify Upsells

interface Props {
  dataSet: any;
}

export const CartUpsells: React.FunctionComponent<Props> = ({
  dataSet,
}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { items } = useCart();
  const { upsellTitle } = useLangStrings(dataSet.langStrings);

  useEffect(() => {
    if (!items || !items.length) return;
    const mostExpensiveItem = items?.reduce((prev, current) => {
      return prev.price > current.price ? prev : current;
    });

    if (!mostExpensiveItem) return;

    axios
      .get(
        `/recommendations/products.json?product_id=${mostExpensiveItem.product_id}&limit=4&intent=related`,
      )
      .then((res) => {
        setProducts(res.data?.products);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [items]);

  if (dataSet.showShopifyUpsells !== "true") {
    return <></>;
  }

  if (dataSet.nostoUpsellId) {
    return (
      <div className="cart-upsells">
        <h4 className="cart-upsells__title heading-2">{upsellTitle}</h4>
        <div
          className="nosto_element"
          data-nosto-elem
          id={dataSet.nostoUpsellId}
        ></div>
      </div>
    );
  }

  return products && products.length > 0 ? (
    <div className="cart-upsells">
      <h4 className="cart-upsells__title heading-2">{upsellTitle}</h4>
      <Swiper
        className="swiper"
        modules={[Navigation, Pagination, FreeMode]}
        loop={true}
        slidesPerView={1}
        spaceBetween={16}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          el: ".swiper-pagination",
          type: "progressbar",
        }}
        breakpoints={{
          1024: {
            spaceBetween: 30,
          },
        }}
      >
        {products.map((product: Product) => {
          return (
            <SwiperSlide key={product.id}>
              <div className="cart-upsell">
                <div className="cart-upsell__image">
                  <Image
                    alt={product.title}
                    width={164}
                    height={164}
                    src={product.featured_image}
                  />
                </div>
                <div className="cart-upsell__details">
                  <h4 className="heading-4">{product.title}</h4>
                  <Price
                    finalPrice={product.price}
                    originalPrice={
                      product.compare_at_price
                        ? product.compare_at_price
                        : product.price
                    }
                    priceVaries={Boolean(product.price_varies)}
                    priceMin={
                      product.min_price ? product.min_price : product.price
                    }
                  />
                  <CartRecommendedSelect product={product} />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
        <button
          aria-label="Previous Slide"
          className="swiper-button swiper-button-prev"
        ></button>
        <button
          aria-label="Next Slide"
          className="swiper-button swiper-button-next"
        ></button>
        <div className="swiper-pagination"></div>
      </Swiper>
    </div>
  ) : null;
};
