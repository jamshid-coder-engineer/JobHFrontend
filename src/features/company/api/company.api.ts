import { $api } from "../../../shared/api/axios-instance";

export const companyApi = {
  
  createMyCompany: async (data: any) => {
    return (await $api.post("/companies/me", data)).data;
  },

  
  getMyCompany: async () => {
    return (await $api.get("/companies/me")).data;
  },

  
  updateMyCompany: async (data: any) => {
    return (await $api.patch("/companies/me", data)).data;
  },

  uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file); 
    return await $api.post("/companies/upload-logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
  },

  
  getOnePublic: async (id: string) => {
    return (await $api.get(`/companies/${id}/public`)).data;
  },

createByInn: async (inn: string) => {

    return await $api.post("/companies/create-by-inn", { inn });
  },

};