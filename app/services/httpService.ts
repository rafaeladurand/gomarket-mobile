import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const service = {
  get: async (url: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer GET", error);
      throw error;
    }
  },

  post: async (url: string, data: any) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer POST", error);
      throw error;
    }
  },

  put: async (url: string, data: any) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer PUT", error);
      throw error;
    }
  },

  delete: async (url: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(url, { headers });
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer DELETE", error);
      throw error;
    }
  },
};

export default service;
