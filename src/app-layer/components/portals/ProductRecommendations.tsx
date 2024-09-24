import React, { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';
import SearchProductCard from './Search/Components/SearchProductCard';

interface ProductRecomendationsProps {
  dataSet: {
    productId: number;
    baseUrl: string;
    limit: number;
    title: string;
  };
}

const ProductRecommendations = (
  props: ProductRecomendationsProps,
): JSX.Element => {
  const [products, setProducts] = useState([]);
  const {
    dataSet: { baseUrl, productId, limit, title },
  } = props;

  useEffect(() => {
    axios
      .get(`${baseUrl}.json?product_id=${productId}&limit=${limit}`)
      .then((res) => {
        const d = res.data;
        if (d && d.products) {
          setProducts(d.products.slice(0, limit));
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [baseUrl, productId, limit]);

  return products && products.length > 0 ? (
    <div className="featured-products">
      <div className="container">
        <div className="featured-products__header">
          <h2 className="heading-3">{title}</h2>
        </div>
        <Swiper
          className="swiper featured-products__swiper"
          modules={[Navigation, Pagination, FreeMode]}
          loop={true}
          slidesPerView={1.5}
          spaceBetween={16}
          freeMode={true}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{
            el: '.swiper-pagination',
            type: 'progressbar',
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 8,
              freeMode: false,
            },
          }}
        >
          {products.map((product, i) => (
            <SwiperSlide key={`product-recommendation-${i}`}>
              <SearchProductCard product={product} simple={true} />
            </SwiperSlide>
          ))}
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
    </div>
  ) : null;
};

export default ProductRecommendations;
