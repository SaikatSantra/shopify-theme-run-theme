import axios, { AxiosResponse } from 'axios';

const BoostCommerceApi = (apiKey: string, apiEndpoint: string):
  {
    request: (endpoint, query) => Promise<AxiosResponse<any>>
  } => {
  
  const axiosInstance = axios.create({
    baseURL: apiEndpoint,
    headers: {'Content-type': 'application/json'}
  });

  const serialize = (object: any, prefix: string|null = null) => {
    const str = []
    Object.keys(object).forEach((p) => {
      const k = prefix ? prefix + '[' + p + ']' : p, v = object[p];
      str.push((v !== null && typeof v === 'object') ?
        serialize(v, k) :
        encodeURIComponent(k) + '=' + encodeURIComponent(v));
    })
    return str.join('&');
  }

  const request = async (endpoint, query) => {

    query.shop = apiKey

    const url = `${endpoint}?${new URLSearchParams(serialize(query)).toString()}`

    return await axiosInstance.get(url)
  }

  return {
    request
  }
}

export default BoostCommerceApi