const apiUrl = import.meta.env.VITE_API_URL;
const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL is not configured.");
}

if (!mediaBaseUrl) {
  throw new Error("VITE_MEDIA_BASE_URL is not configured.");
}

export const env = {
  apiUrl,
  mediaBaseUrl,
} as const;