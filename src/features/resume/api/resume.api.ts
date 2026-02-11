import { $api } from "../../../shared/api/axios-instance";

export const resumeApi = {
  getMe: async () => {
    const { data } = await $api.get("/resumes/me");
    return data;
  },

  create: async (dto: any) => {
    
    const payload = {
      fullName: dto.fullName,
      title: dto.title,
      about: dto.about || "",
      city: dto.city,
      phone: dto.phone,
      skills: dto.skills,
    };
    const { data } = await $api.post("/resumes", payload);
    return data;
  },

  update: async (dto: any) => {
    
    const payload = {
      fullName: dto.fullName,
      title: dto.title,
      about: dto.about || "",
      city: dto.city,
      phone: dto.phone,
      skills: dto.skills,
    };
    const { data } = await $api.patch("/resumes/me", payload);
    return data;
  },

  uploadCv: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await $api.patch("/resumes/me/cv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};