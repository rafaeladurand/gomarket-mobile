import axios from "axios";

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
