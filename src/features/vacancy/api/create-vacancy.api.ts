import { $api } from "../../../shared/api/axios-instance";

export const vacancyApi = {
  // 1. PUBLIC (Hamma ko'rishi mumkin bo'lgan qism)
  getPublicVacancies: async (params?: any) => {
    return (await $api.get("/vacancies", { params })).data;
  },

  getOne: async (id: string) => {
    return (await $api.get(`/vacancies/${id}`)).data;
  },

  // 2. EMPLOYER (Ish beruvchi)
  create: async (data: any) => {
    return (await $api.post("/vacancies", data)).data;
  },

  getMyVacancies: async () => {
    return (await $api.get("/vacancies/my")).data;
  },

  // 👇 YANGI QO'SHILGAN UPDATE FUNKSIYASI 👇
  update: async (id: string, data: any) => {
    return (await $api.patch(`/vacancies/${id}`, data)).data;
  },
  // 👆 ---------------------------------- 👆
// ... object ichiga qo'shing:

  getSuggestions: async (query: string) => {
    // Agar bo'sh bo'lsa so'rov yuborma
    if (!query) return [];
    return (await $api.get("/vacancies/autocomplete", { params: { q: query } })).data;
  },
  
getCitySuggestions: async (query: string) => {
    if (!query) return [];
    return (await $api.get("/vacancies/autocomplete/city", { params: { q: query } })).data;
  },

  deleteVacancy: async (id: string) => {
    return (await $api.delete(`/vacancies/${id}`)).data;
  },
  
  submitForModeration: async (id: string) => {
    return (await $api.patch(`/vacancies/${id}/submit`)).data;
  },
};