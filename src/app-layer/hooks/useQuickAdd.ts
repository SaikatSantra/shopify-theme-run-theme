import { useEffect, useState } from 'react';
// import { useCart } fshrom './useCart'
import axios from 'axios';
import getMatchingVariants from '../components/portals/QuickAdd/getMatchingVariants';
import { OptionList, Product, ProductVariant } from '../util/typings';
import safeJSONParse from '../../scripts/utils/safeJsonParse';
import getRoute from '../../scripts/utils/getRoute';

interface QuickAddHookResponse {
  product: Product;
  stockMap: Record<string, string>;
  currentVariant: ProductVariant;
  setHandle: any;
  selectedOptions: OptionList;
  setSelectedOptions: any;
}

export const useQuickAdd = (): QuickAddHookResponse => {
  const [loading, setLoading] = useState(null as null | string);
  const [handle, setHandle] = useState(null as null | string);
  const [product, setProduct] = useState(null as null | Product);
  const [stockMap, setStockMap] = useState({} as Record<string, string>);
  const [selectedOptions, setSelectedOptions] = useState([
    null,
    null,
    null,
  ] as OptionList);
  const [currentVariant, setCurrentVariant] = useState(
    null as null | ProductVariant,
  );
  // const { addToCart } = useCart();

  const setDOMHelpers = () => {
    window['blubolt'].quickadd = {
      open: (handle, settings) => {
        setLoading(handle);
        let stockMap = {};
        try {
          stockMap = safeJSONParse(settings.stockMap);
        } catch (e) {
          console.info(e);
        }
        setStockMap(stockMap);
        setHandle(handle);
      },
    };
  };

  useEffect(() => {
    setDOMHelpers();
  }, []);

  useEffect(() => {
    if (loading) {
      const button = document.querySelector(
        `[data-quick-add-btn="${loading}"]`,
      );
      button.classList.add('loading');
    } else {
      const buttons = document.querySelectorAll('[data-quick-add-btn]');
      buttons.forEach((btn) => btn.classList.remove('loading'));
    }
  }, [loading]);

  useEffect(() => {
    if (!product) {
      setCurrentVariant(null);
      return;
    }
    const matchingVariants = getMatchingVariants(
      selectedOptions,
      product.variants,
    );
    const selectedLength = selectedOptions.reduce(
      (acca, option) => (option === null ? acca : acca + 1),
      0,
    );
    if (
      selectedLength === product.options.length &&
      matchingVariants.length === 1
    ) {
      setCurrentVariant(matchingVariants[0]);
    } else {
      setCurrentVariant(null);
    }
  }, [selectedOptions, product]);

  useEffect(() => {
    // default state assuming the component is still active
    let unmounted = false;
    if (handle) {
      const route = getRoute();
      let currencyQuery = '';
      if (route !== '/') {
        // getting odd redirect pattern happening without confirming currency
        // within url here
        currencyQuery = `?currency=${window.Shopify.currency.active}`;
      }
      axios
        .get(`${route}products/${handle}.js${currencyQuery}`)
        .then(({ data }) => {
          // only set the below data if we haven't since removed the portal
          if (!unmounted) {
            const product = data as Product;
            setProduct(product);
            setLoading(null);

            // This will automatically add a product to the cart if it only has one variant
            // I have commented it out for a more consistent user experience
            // if (product.variants.length === 1) {
            //   addToCart(
            //     [{
            //       id: product.variants[0].id,
            //       quantity: 1
            //     }],
            //     true,
            //     () => {
            //       setHandle(null)
            //       setLoading(null)
            //     }
            //   )
            // } else {
            //   setProduct(product)
            //   setLoading(null)
            // }
          }
        });
    } else {
      setProduct(null);
      setSelectedOptions([null, null, null]);
      setLoading(null);
    }
    return () => {
      // cleanup when unmounted
      // preventing delayed axios requests loading late
      unmounted = true;
    };
  }, [handle]);

  return {
    product,
    stockMap,
    currentVariant,
    setHandle,
    selectedOptions,
    setSelectedOptions,
  };
};
