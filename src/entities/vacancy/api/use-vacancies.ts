import { useQuery } from "@tanstack/react-query";
import { VacancyApi } from "./vacancy-api";

export const useVacancies = () => {
  return useQuery({
    queryKey: ["vacancies"],
    queryFn: VacancyApi.getAll,
  });
};