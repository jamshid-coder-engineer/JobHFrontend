import { $api } from "../../../shared/api/axios-instance";

export const companyApi = {
  // 1. Kompaniya yaratish (Sizda: POST /companies/me)
  createMyCompany: async (data: any) => {
    return (await $api.post("/companies/me", data)).data;
  },

  // 2. Mening kompaniyamni olish (Sizda: GET /companies/me)
  getMyCompany: async () => {
    return (await $api.get("/companies/me")).data;
  },

  // 3. O'zgartirish (Sizda: PATCH /companies/me)
  updateMyCompany: async (data: any) => {
    return (await $api.patch("/companies/me", data)).data;
  },

  uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file); // Backendda @UploadedFile() nima nom bilan kutayotganiga qarang ('file' yoki 'logo')
    return await $api.post("/companies/upload-logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
  },

  // 5. Ommaviy ko'rish (Sizda: GET /companies/:id/public)
  getOnePublic: async (id: string) => {
    return (await $api.get(`/companies/${id}/public`)).data;
  },

createByInn: async (inn: string) => {
    // Backenddagi: @Post('create-by-inn') ga yuboramiz
    return await $api.post("/companies/create-by-inn", { inn });
  },

};