export const environment = {
  production: import.meta.env.MODE === 'production',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
};
