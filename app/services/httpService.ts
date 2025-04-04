import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

const service = {
  get: async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer GET", error);
      throw error;
    }
  },

  post: async (url: string , data: any) => {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer POST", error);
      throw error;
    }
  },

  put: async (url: string, data: any) => {
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer PUT", error);
      throw error;
    }
  },

  delete: async (url: string) => {
    try {
      const response = await axios.delete(url);
      return response.data;
    } catch (error) { 
      console.error("Erro ao fazer DELETE", error);
      throw error;
    }
  },
};

export default service;
