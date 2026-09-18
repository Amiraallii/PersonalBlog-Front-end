import { AxiosError } from "axios";

import { api } from "../../../services/api";
import type { PersonalInfo } from "../types";

export const AboutMeService = {
  get: async (): Promise<PersonalInfo | null> => {
    try {
      const response = await api.get<PersonalInfo>(
        "/PersonalInformation/GetPersonalInfo",
      );

      return response.data;
    } catch (error: unknown) {
      if (
        error instanceof AxiosError &&
        error.response?.status === 404
      ) {
        return null;
      }

      throw error;
    }
  },

  modify: async (data: PersonalInfo): Promise<void> => {
    await api.post("/PersonalInformation/ModifyInfo", data);
  },
};