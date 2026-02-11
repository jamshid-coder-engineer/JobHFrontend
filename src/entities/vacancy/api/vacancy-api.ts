import { $api } from "../../../shared/api/axios-instance";

export const VacancyApi = {
  getAll: async () => {
    const response = await $api.get("/vacancies");
    
    
    console.log(response.data.data);
    return response.data.data; 
    
  }
};