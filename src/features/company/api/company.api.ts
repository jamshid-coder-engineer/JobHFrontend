import { $api } from "../../../shared/api/axios-instance";


export const companyApi = {
  // Kompaniya yaratish (POST /companies/me)
  createMyCompany: async (data: any) => {
    const response = await $api.post('/companies/me', data);
    return response.data;
  },
  // O'z kompaniyasini olish (GET /companies/me)
  getMyCompany: async () => {
    const response = await $api.get('/companies/me');
    return response.data;
  }
};