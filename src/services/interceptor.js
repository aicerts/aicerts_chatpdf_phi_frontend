

import axios from 'axios';
import { userServerConfig } from '../config/server-config';

const appServerURL = userServerConfig.userServerUrl;

const postAxiosInstance = axios.create({
  baseURL: appServerURL
});


postAxiosInstance.interceptors.request.use(
  config => {
    let token = null;
try {
  token = localStorage.getItem('JWTToken');
} catch (error) {
  console.error('Error parsing token:', error);
}

    // console.log(token)
    if (token) {
      config.headers.Authorization =`Bearer ${token}` ;
    }else{
      router.push('/login');
    localStorage.clear()
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


postAxiosInstance.interceptors.response.use(
  response => {

    // Perform actions before response is handled
    return response;
  },
  error => {

    return Promise.reject(error);
  }
);

export default postAxiosInstance;


export const preAxiosInstance = axios.create({
  baseURL: appServerURL
});

preAxiosInstance.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/json'
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

preAxiosInstance.interceptors.response.use(
  response => {
    // Perform actions before response is handled
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);