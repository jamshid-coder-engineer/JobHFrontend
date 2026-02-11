import { $api } from "../../../shared/api/axios-instance";

export const adminApi = {
  
  getStats: async () => {
    const response = await $api.get("/admin/statistics");
    return response.data;
  },

  
  getCompanies: async (status?: string) => {
    const response = await $api.get("/admin/companies", { params: { status } });
    return response.data;
  },

  
  createAdmin: async (data: any) => (await $api.post("/admin/create", data)).data,

  getAdmins: async () => (await $api.get("/admin/list")).data,

  deleteAdmin: async (id: string) => (await $api.delete(`/admin/${id}`)).data,
  
  approveCompany: async (id: string) => {
    return (await $api.patch(`/admin/companies/${id}/approve`)).data;
  },

  rejectCompany: async (id: string, reason: string) => {
    return (await $api.patch(`/admin/companies/${id}/reject`, { reason })).data;
  },

  getVacancies: async (status?: string) => {
    const response = await $api.get("/admin/vacancies", { params: { status } });
    return response.data;
  },

  approveVacancy: async (id: string) => {
    return (await $api.patch(`/admin/vacancies/${id}/approve`)).data;
  },
  rejectVacancy: async (id: string, reason: string) => {
  return (await $api.patch(`/admin/vacancies/${id}/reject`, { reason })).data;
},

setPremium: async (id: string, days: number) => {

  const response = await $api.patch(`/admin/vacancies/${id}/premium`, { days });
  return response.data;
},
};