import { toast } from "react-toastify";
import postAxiosInstance, { preAxiosInstance } from "../interceptor";
//call this in exceptional cases
import 'react-toastify/dist/ReactToastify.css';
export const allCommonApis = async (url, req = 'get', data = {},
config = {}) => {
  //   const config = {
  //     headers: {
  //       'X-Custom-Header': 'CustomValue',
  //     }
  //   };
  //   const data = {
  //     key: 'value',
  //   };
  try {
    const response = await postAxiosInstance[req](url, data, config);
    return response
  } catch (error) {
    // toast.error(error?.response?.data.message || 'Something went wrong');

    console.error('Something went wrong', error);
    return false
  }
};

export default allCommonApis;

export const  registerApi = async (url, data = {}) => {
  try {
    const response = await preAxiosInstance.post(url, data);
    return response;
  } catch (error) {
    
    // toast.error(error.response.data.message || 'Something went wrong');
    // console.error('Something went wrong', (error.message));
    return error;
  }
}

export const  loginPostApi = async (url, data) => {
  try {
    const response = await preAxiosInstance.post(url, data);
    if(response?.data?.data && response?.data?.data?.JWTToken){
        toast.success("Login Successful");
      localStorage.setItem('JWTToken',response?.data?.data?.JWTToken);
      localStorage.setItem('User',JSON.stringify(response?.data?.data));
    }
    return response;
  } catch (error) {
    // toast.error(error.response.data.message || 'Something went wrong');
    // console.error('Something went wrong', (error.message));
    return false
  }
}


export const  forgotPasswordApi = async (url, data) => {
  try {
    const response = await preAxiosInstance.post(url, data);
    return response;
  } catch (error) {
    toast.error(error.response.data.message || 'Something went wrong');
    return false
  }
}
