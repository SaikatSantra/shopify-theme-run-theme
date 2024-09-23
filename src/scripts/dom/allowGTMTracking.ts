const allowGTMTracking = (): void => {
  if (window['dataLayer']) {
    window['dataLayer'].push([
      'consent', 'update', {
        'ad_storage': 'granted',
        'analytics_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      }
    ])
  }
}

export default allowGTMTracking
