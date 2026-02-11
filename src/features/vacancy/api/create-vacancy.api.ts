import { $api } from "../../../shared/api/axios-instance";

export const vacancyApi = {
  
  getPublicVacancies: async (params: any) => {
    return await $api.get("/vacancies", { params }); 
  },

  
  getOne: async (id: string) => {
    return (await $api.get(`/vacancies/${id}`)).data;
  },

  create: async (data: any) => {
    return (await $api.post("/vacancies", data)).data;
  },

  getMyVacancies: async () => {
    return (await $api.get("/vacancies/my")).data;
  },

  update: async (id: string, data: any) => {
    return (await $api.patch(`/vacancies/${id}`, data)).data;
  },

  deleteVacancy: async (id: string) => {
    return (await $api.delete(`/vacancies/${id}`)).data;
  },
  
  submitForModeration: async (id: string) => {
    return (await $api.patch(`/vacancies/${id}/submit`)).data;
  },

  getSuggestions: async (query: string) => {
    if (!query) return [];
    return (await $api.get("/vacancies/autocomplete", { params: { q: query } })).data;
  },
  
  getCitySuggestions: async (query: string) => {
    if (!query) return [];
    return (await $api.get("/vacancies/autocomplete/city", { params: { q: query } })).data;
  },

  toggleSave: async (id: string) => {
    return (await $api.post(`/vacancies/${id}/save`)).data;
  },

  getSavedVacancies: async () => {
    return (await $api.get("/vacancies/my/saved")).data;
  },
};