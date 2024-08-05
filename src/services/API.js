import axios from 'axios';
import { serverConfig } from '../config/server-config';

const appServerURL = serverConfig.appServerUrl;

const ChatPdfAPI = (config) => {``
  const token = process.env.NEXT_PUBLIC_API_KEY
  if (token != null) {
    config.headers = {
      // "Content-Type": "multipart/form-data",
      // "x-api-key": token,
    };
  }

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      if (!error.response) {
        error.response = {
          data: 'INETRNAL SERVER ERROR',
          status: 500,
        };
      }
      if (error.response.status === 401) {
        throw error;
      }
      return Promise.reject(error);
    }
  );

  config.baseURL = appServerURL;
  return axios(config);
};
export default ChatPdfAPI;