import axios from 'axios';

const KlevuApi = (apiKey: string, apiEndpoint: string) => {

  const axiosInstance = axios.create({
    baseURL: apiEndpoint,
    headers: {'Content-type': 'application/json'}
  });


  const request = async (query) => {
    return await axiosInstance.post('search', {
      context: {
        apiKeys: [
          apiKey
        ],
      },
      ...query
    })
  }

  return {
    request
  }
}

export default KlevuApi