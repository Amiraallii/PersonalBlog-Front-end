export interface Project {
  id: number;
  title: string;
  summary: string;
  link: string;
  owner: string;
  startDate: string;
  endDate: string | null;
}

export interface ProjectResponse {
  items: Project[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface CreateProjectDTO {
  title: string;
  summary: string;
  link: string;
  owner: string;
  startDate: string;
  endDate: string | null;
}

export interface RequestProjectDTO {
  title: string;
  summary: string;
  phoneNumber: string;
  location: string;
}