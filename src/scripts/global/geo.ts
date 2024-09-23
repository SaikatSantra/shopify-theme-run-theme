import axios from 'axios'
import getRoute from '../utils/getRoute'

export const initGeo = async (): Promise<void> => {
  try {
    const {data} = await axios.get('/browsing_context_suggestions.json')
    const el = document.querySelector('[data-geo-switcher]') as HTMLDivElement
    const handle = data.detected_values.country.handle;

    if (!el) return

    const countryRedirectData = document.querySelector('[data-geo-locales-list]') as HTMLElement
    const route = getRoute(true);
    let desiredLocale = null

    if(countryRedirectData) {
      const list = JSON.parse(countryRedirectData.dataset.geoLocalesList)
      desiredLocale = list.filter(l => l.localesNotToShow.includes(data.detected_values.country.handle))[0]
    }

    const currencySelectorDT = document.querySelector('[data-currency-selector-dt]') as HTMLElement;
    if(currencySelectorDT) {
      currencySelectorDT.classList.remove('nopacity')
    }

    const triggerDismiss = () => {
      document.body.classList.remove('geo-open')
      window.localStorage.setItem('geoDismissed', handle)
    }

    const dismisses = el.querySelectorAll('[data-geo-dismiss]') as NodeListOf<HTMLElement>
    dismisses.forEach(dismiss => {
      dismiss.addEventListener('click', () => {
        triggerDismiss()
      })
    })

    let newUrl;
    const regionOption = el.querySelector('[data-geo-switcher-region]') as HTMLSelectElement;
    const regionOptions = regionOption?.querySelectorAll('option') as NodeListOf<HTMLOptionElement>;
    const languageOption = el.querySelector('[data-geo-switcher-language]') as HTMLSelectElement;
    const languageOptions = languageOption?.querySelectorAll('option') as NodeListOf<HTMLOptionElement>;

    regionOptions?.forEach(option => {
      if (window.location.href.includes(option.value)) {
        option.setAttribute('selected', 'selected');
      }
    })

    regionOption?.addEventListener('change', () => {
      const regionTitle = regionOption.options[regionOption.selectedIndex].dataset.region;
      const selectedRegion = regionTitle;

      languageOptions?.forEach((option, i) => {
        if ((option.dataset.region === selectedRegion)) {
          option.classList.remove('hide')
          if (i === 0 || option.previousElementSibling.classList.contains('hide')) {
            option.setAttribute('selected', 'selected')
            newUrl = option.value
          }
        } else {
          option.removeAttribute('selected')
          option.classList.add('hide')
        }
      })
    })

    // This runs when the switcher is loaded and sets the correct selected option
    // The hide class is set in geo-switcher.liquid
    languageOptions?.forEach((option, i) => {
      if ((!option.classList.contains('hide') && i === 0) || window.location.href === option.value || (option.previousElementSibling && option.previousElementSibling.classList.contains('hide'))) {
        option.setAttribute('selected', 'selected');
      }
    })

    languageOption?.addEventListener('change', (el) => {
      newUrl = (el.target as HTMLSelectElement).value;
    })

    const btn = el.querySelector('[data-geo-switcher-redirect]') as HTMLButtonElement;


    btn.addEventListener('click', () => {
      // Debug
      // console.log(`Debug: ${newUrl ? window.location.href.replace(`${window.location.origin}/`, newUrl) : 'close'}`)
      triggerDismiss();
      newUrl ? window.location.href = window.location.href.replace(`${window.location.origin}/`, newUrl) : triggerDismiss()
    })


    const countryEls = el.querySelectorAll('[data-geo-switcher-domain]') as NodeListOf<HTMLElement>;

    countryEls.forEach(country => {
      if (!window.location.href.includes(country.dataset.geoSwitcherDomain)) {
        country.remove();
      } else {
        document.querySelectorAll('[data-currency-selector-currency]').forEach(el => {
          el.innerHTML = country.dataset.geoSwitcherCurrency
        });
        document.querySelectorAll('[data-currency-selector-language]').forEach(el => {
          el.innerHTML = languageOption.options[languageOption.selectedIndex].dataset.code
        });
      }
    })

    const simplyOpen = (): void => {
      document.body.classList.add('geo-open')
    }

    // Debug
    // simplyOpen()

    const externalOpeners = document.querySelectorAll('[data-geo-open]') as NodeListOf<HTMLElement>
    externalOpeners.forEach(opener => {
      opener.addEventListener('click', simplyOpen)
    })

    //show on load??
    const show = window.localStorage.getItem('geoDismissed') !== handle && !desiredLocale?.subFolder.includes(route);
    
    if (!show) return;

    simplyOpen()
  } catch (e) {
    console.info(e)
  }
}