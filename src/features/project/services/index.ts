import { api } from "../../../services/api"; 
import type { ProjectResponse, Project, CreateProjectDTO, RequestProjectDTO } from "../types";

export const projectService = {

  getAll: async (size: number, skip: number): Promise<ProjectResponse> => {
    const response = await api.get<ProjectResponse>(
      `/Project/GetAllProjects?Size=${size}&Skip=${skip}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/Project/GetProjectById?id=${id}`);
    return response.data;
  },

  create: async (data: CreateProjectDTO): Promise<void> => {
    await api.post("/Project/NewProject", data);
  },

  request: async (data: RequestProjectDTO): Promise<void> => {
    await api.post("/ProjectRequest/RequestNewProject", data);
  }
};