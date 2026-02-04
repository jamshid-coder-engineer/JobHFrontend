import { $api } from "../../../shared/api/axios-instance";

export const vacancyApi = {
  // --- 1. PUBLIC (Hamma ko'rishi mumkin bo'lgan qism) ---
  
  // Bosh sahifa va Vakansiyalar ro'yxati uchun
  getPublicVacancies: async (params?: any) => {
    // Backenddagi @Get('vacancies') ga boradi
    return (await $api.get("/vacancies", { params })).data;
  },

  // Bitta vakansiyani ichini ochish uchun
  getOne: async (id: string) => {
    return (await $api.get(`/vacancies/${id}`)).data;
  },

  // --- 2. EMPLOYER (Ish beruvchi) ---

  create: async (data: any) => {
    return (await $api.post("/vacancies", data)).data;
  },

  getMyVacancies: async () => {
    return (await $api.get("/vacancies/my")).data;
  },

  deleteVacancy: async (id: string) => {
    return (await $api.delete(`/vacancies/${id}`)).data;
  },
  
  // Moderatsiyaga yuborish (agar kerak bo'lsa)
  submitForModeration: async (id: string) => {
    return (await $api.patch(`/vacancies/${id}/submit`)).data;
  },
};