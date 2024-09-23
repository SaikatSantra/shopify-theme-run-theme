import React, { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import parseJson from "json-parse-better-errors";
import SearchProductCard from "../Search/Components/SearchProductCard";
import useProductData from "../../../hooks/useProductData";

interface RecentlyViewedProps {
  dataSet: {
    handle: string;
    limit: string;
    shopDomain: string;
  };
}

const getRecentlyViewedFromStorage = (shopDomain: string) => {
  const data = window.localStorage.getItem(
    `blubolt:recentlyViewed:${shopDomain}`,
  );
  if (!data) {
    return [];
  }
  return parseJson(data);
};

const handleRecentlyViewedHandles = (
  handle: string,
  limit: number,
  shopDomain: string,
) => {
  const currentStorage = getRecentlyViewedFromStorage(shopDomain);
  if (!currentStorage) return;
  if (
    currentStorage.length &&
    currentStorage.some((storageHandle) => storageHandle === handle)
  ) {
    // If currentStorage exists and contains the current handle then return
    return currentStorage;
  } else {
    // Else add the new handle to the array and slice to ensure we're not over the limit
    const newData = [handle, ...currentStorage].slice(0, limit + 1);
    window.localStorage.setItem(
      `blubolt:recentlyViewed:${shopDomain}`,
      JSON.stringify(newData),
    );
    return newData;
  }
};

const RecentlyViewed: React.FunctionComponent<RecentlyViewedProps> = ({
  dataSet,
}: RecentlyViewedProps) => {
  const { handle, limit, shopDomain } = dataSet;
  const [filteredProductData, setFilteredProductData] = useState(null);
  const productData = useProductData(
    handleRecentlyViewedHandles(handle, parseInt(limit), shopDomain),
  );

  useEffect(() => {
    if (productData?.length) {
      const filtered = productData.filter(
        (product) => product.handle !== handle,
      );
      if (filtered.length > parseInt(limit) + 1) {
        // If we're over the limit, see ya!
        filtered.pop();
      }
      setFilteredProductData(filtered);
    }
  }, [productData]);

  return (
    <>
      {filteredProductData?.length ? (
        <Swiper
          className="swiper featured-products__swiper"
          modules={[Navigation, Pagination, FreeMode]}
          loop={true}
          slidesPerView={1.5}
          spaceBetween={16}
          freeMode={true}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            type: "progressbar",
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
              freeMode: false,
            },
          }}
        >
          {filteredProductData?.length
            ? filteredProductData.map((product, index: number) => {
                return (
                  <SwiperSlide key={index}>
                    <SearchProductCard product={product} simple={true} />
                  </SwiperSlide>
                );
              })
            : null}
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
      ) : null}
    </>
  );
};

export default RecentlyViewed;
