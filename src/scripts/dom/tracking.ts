export const loadTrackingConsentAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    window['Shopify'].loadFeatures(
      [
        {
          name: 'consent-tracking-api',
          version: '0.1',
        },
      ],
      error => {
        if (error) {
          reject(error)
        }
        resolve()
      },
    );
  })
}


export const checkIfUserCanBeTracked = (): Promise<[boolean, 'yes' | 'no' | 'no_interaction']> => {
  return new Promise((resolve, reject) => {
    try {
      loadTrackingConsentAPI().then(() => {
        const userCanBeTracked = window['Shopify'].customerPrivacy.userCanBeTracked();
        const userTrackingConsent = window['Shopify'].customerPrivacy.getTrackingConsent();
        resolve([userCanBeTracked, userTrackingConsent])
      })
    } catch (e) {
      reject(e)
    }
  })
}

export const setTrackingConsent = (consent: boolean) : Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      loadTrackingConsentAPI().then(() => {
        window['Shopify'].customerPrivacy.setTrackingConsent(consent, () => {
          if (consent) {
            document.dispatchEvent(new Event('tracking-consent-given'))
          } else {
            document.dispatchEvent(new Event('tracking-consent-rejected'))
          }
          resolve()
        });
      })
    } catch (e) {
      reject(e)
    }
  })
}


export const onConsentLoad = (cb: (consent: boolean) => void): void => {

  checkIfUserCanBeTracked().then(([userCanBeTracked]) => {
    cb(userCanBeTracked)
  })

  document.addEventListener('tracking-consent-given', () => {
    cb(true)
  })
}
