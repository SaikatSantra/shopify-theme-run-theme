const updateLocationQuery = (params: {
  key: string,
  value?: string,
  action: 'set' | 'delete',
  historyMethod? : 'replaceState' | 'pushState' // default to replaceState
}): void => {
  const historyMethod = params.historyMethod ? params.historyMethod : 'replaceState';
  if (history) {
    const searchParams = new URLSearchParams(window.location.search);

    if (params.action === 'set') {
      searchParams.set(params.key, params.value);
    } else if (params.action === 'delete') {
      searchParams.delete(params.key)
    }

    const updatedUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${searchParams.toString()}`
    if (window.location.toString() !== updatedUrl) {
      window.history[historyMethod]({ path: updatedUrl }, '', updatedUrl);
    }
  }
}

export default updateLocationQuery