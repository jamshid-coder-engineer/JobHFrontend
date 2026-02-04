import { $api } from "../../../shared/api/axios-instance";

export const loginUser = async (dto: any) => {
  const response = await $api.post("/auth/login", dto);
  return response.data; // Bekentdagi successRes formatida keladi
};