/**
 * Country setup from the Dawn theme:
 *
 * https://github.com/Shopify/dawn/blob/main/assets/customer.js#L35
 */
export const initCountrySetup = (): void => {
  window['Shopify'].setSelectorByValue = function (selector, value) {
    for (let i = 0, count = selector.options.length; i < count; i++) {
      const option = selector.options[i];
      if (value === option.value || value === option.innerHTML) {
        selector.selectedIndex = i;
        return i;
      }
    }
    return 0;
  };
  window['Shopify'].addListener = function (target, eventName, callback) {
    target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on' + eventName, callback);
  };

  window['Shopify'].bind = function (fn, scope) {
    return function () {
      // eslint-disable-next-line prefer-rest-params
      return fn.apply(scope, arguments);
    }
  };

  window['Shopify'].CountryProvinceSelector = function (country_domid, province_domid, options) {
    this.countryEl = document.getElementById(country_domid);
    this.provinceEl = document.getElementById(province_domid);
    this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

    window['Shopify'].addListener(this.countryEl, 'change', window['Shopify'].bind(this.countryHandler, this));

    this.initCountry();
    this.initProvince();
  };

  window['Shopify'].CountryProvinceSelector.prototype = {
    initCountry: function () {
      const value = this.countryEl.getAttribute('data-default');
      window['Shopify'].setSelectorByValue(this.countryEl, value);
      this.countryHandler();
    },

    initProvince: function () {
      const value = this.provinceEl.getAttribute('data-default');
      if (value && this.provinceEl.options.length > 0) {
        window['Shopify'].setSelectorByValue(this.provinceEl, value);
      }
    },

    countryHandler: function () {
      const opt = this.countryEl.options[this.countryEl.selectedIndex];
      const raw = opt.getAttribute('data-provinces');
      const provinces = JSON.parse(raw);

      this.clearOptions(this.provinceEl);
      if (provinces && provinces.length === 0) {
        this.provinceContainer.style.display = 'none';
      } else {
        for (let i = 0; i < provinces.length; i++) {
          const option = document.createElement('option');
          option.value = provinces[i][0];
          option.innerHTML = provinces[i][1];
          this.provinceEl.appendChild(option);
        }

        this.provinceContainer.style.display = '';
      }
    },

    clearOptions: function (selector) {
      while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
      }
    },

    setOptions: function (selector, values) {
      for (let i = 0; i < values.length; i++) {
        const opt = document.createElement('option');
        opt.value = values[i];
        opt.innerHTML = values[i];
        selector.appendChild(opt);
      }
    }
  };

  const countrySelects: NodeListOf<HTMLSelectElement> = document.querySelectorAll('[data-address-country-select]');

  if (window['Shopify'] && window['Shopify'].CountryProvinceSelector) {
    // eslint-disable-next-line no-new
    new window['Shopify'].CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });

    countrySelects.forEach((select) => {
      const formId = select.dataset.formId;
      // eslint-disable-next-line no-new
      new window['Shopify'].CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
        hideElement: `AddressProvinceContainer_${formId}`
      });
    });
  }
}