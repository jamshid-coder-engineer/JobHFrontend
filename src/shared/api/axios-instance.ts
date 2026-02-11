import axios from "axios";

export const $api = axios.create({
  baseURL: "http://localhost:2026/api/v1", 
  withCredentials: true, 
});


$api.interceptors.response.use(
  (config) => {
    return config; 
  },
  async (error) => {
    const originalRequest = error.config;

    
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true; 

      try {
        
        await $api.post("/auth/refresh"); 
        
        
        return $api.request(originalRequest);
      } catch (e) {
        
        console.log("Sessiya tugadi, chiqib ketilmoqda...");
      }
    }
    
    throw error;
  }
);