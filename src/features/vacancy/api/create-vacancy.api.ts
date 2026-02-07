import { $api } from "../../../shared/api/axios-instance";

export const vacancyApi = {
  // 1. Ommaviy qidiruv (Nomzodlar uchun)
  getPublicVacancies: async (params: any) => {
    return await $api.get("/vacancies", { params }); 
  },

  // 2. Bitta vakansiyani olish
  getOne: async (id: string) => {
    return (await $api.get(`/vacancies/${id}`)).data;
  },

  // 3. Vakansiya yaratish (Ish beruvchi)
  create: async (data: any) => {
    return (await $api.post("/vacancies", data)).data;
  },

  // 4. Mening vakansiyalarim (Ish beruvchi)
  getMyVacancies: async () => {
    return (await $api.get("/vacancies/my")).data;
  },

  // 5. O'zgartirish
  update: async (id: string, data: any) => {
    return (await $api.patch(`/vacancies/${id}`, data)).data;
  },

  // 6. O'chirish
  deleteVacancy: async (id: string) => {
    return (await $api.delete(`/vacancies/${id}`)).data;
  },
  
  // 7. Moderatsiyaga yuborish
  submitForModeration: async (id: string) => {
    return (await $api.patch(`/vacancies/${id}/submit`)).data;
  },

  // 8. Autocomplete (Qidiruv yordamchisi)
  getSuggestions: async (query: string) => {
    if (!query) return [];
    return (await $api.get("/vacancies/autocomplete", { params: { q: query } })).data;
  },
  
  getCitySuggestions: async (query: string) => {
    if (!query) return [];
    return (await $api.get("/vacancies/autocomplete/city", { params: { q: query } })).data;
  },

  // 👇 YANGI QO'SHILGAN: SAQLASH (YURAKCHA) ❤️
  toggleSave: async (id: string) => {
    return (await $api.post(`/vacancies/${id}/save`)).data;
  },

  getSavedVacancies: async () => {
    return (await $api.get("/vacancies/my/saved")).data;
  },
};