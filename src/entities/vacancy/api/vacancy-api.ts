import { $api } from "../../../shared/api/axios-instance";

export const VacancyApi = {
  getAll: async () => {
    const response = await $api.get("/vacancies");
    
    // Agarda backend ma'lumotni { data: [...] } ichida yuborsa:
    console.log(response.data.data);
    return response.data.data; 
    
  }
};