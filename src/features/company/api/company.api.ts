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

  // 4. Logo yuklash (Sizda: PATCH /companies/me/logo)
  // Eslatma: Bu yerda 'file' FormData ichida ketishi kerak
  uploadLogo: async (formData: FormData) => {
    return (await $api.patch("/companies/me/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  },

  // 5. Ommaviy ko'rish (Sizda: GET /companies/:id/public)
  getOnePublic: async (id: string) => {
    return (await $api.get(`/companies/${id}/public`)).data;
  },
};