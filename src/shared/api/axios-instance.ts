import axios from "axios";

export const $api = axios.create({
  baseURL: "http://localhost:2026/api/v1", // Bekent portingizni (5000 yoki 2026) tekshiring!
  withCredentials: true,
});

$api.interceptors.request.use((config) => {
  // 1. Zustand saqlagan obyektni olamiz
  const storage = localStorage.getItem("user-storage");
  
  if (storage) {
    try {
      // 2. JSON-ni parse qilamiz
      const parsedData = JSON.parse(storage);
      // 3. Obyekt ichidan accessToken-ni sug'urib olamiz
      const token = parsedData.state?.accessToken;

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Tokenni olishda xato:", error);
    }
  }
  
  return config;
});