export const config = Object.freeze({
  BASE_URL: import.meta.env.VITE_SERVER_URL,
  API_URL_LOGIN: `${import.meta.env.VITE_SERVER_URL}/login`,
  API_URL_REGISTER: `${import.meta.env.VITE_SERVER_URL}/register`,
  API_URL_USERS: `${import.meta.env.VITE_SERVER_URL}/users`,
  API_URL_DELETE: `${import.meta.env.VITE_SERVER_URL}/delete`,
  API_URL_BLOCK: `${import.meta.env.VITE_SERVER_URL}/block`,
  API_URL_UNBLOCK: `${import.meta.env.VITE_SERVER_URL}/unblock`,
});
