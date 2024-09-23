import { useEffect, useState } from "react";
import { Product } from "../../app-layer/util/typings";
import axiosGetFullProductJSON from "../../scripts/sections/product/axiosGetFullProductJSON";

//@TODO 👇 this should be typed to Product but as it shares the SearchProductCard the typings will need to be
//refactored, so theres x1 React Product Card shared across the site

const useProductData = (handles: string[]): Product[] => {
  const [productData, setProductData] = useState(null);
  useEffect(() => {
    (async () => {
      const data = await Promise.all(
        handles.map(async (handle) => {
          try {
            const response = await axiosGetFullProductJSON(handle);

            if (response) {
              return response;
            }

            return null;
          } catch (error) {
            console.error(
              "couldnt get product data, check your handles",
              handle,
              error,
            );
            return null;
          }
        }),
      );
      //if fetch of product data was unsuccessful, remove it from productData
      const filteredData = data.filter((item) => item);
      setProductData(filteredData);
    })();
  }, []);

  return productData;
};

export default useProductData;
