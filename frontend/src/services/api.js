import axios from "axios";

// 1. Create the 'api' variable
const api = axios.create({
  baseURL: "/api", // Ensure this matches your Vite proxy or backend URL
});

// 2. Add the interceptor (to attach token automatically)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // List of public URLs that don't need a token
    const publicEndpoints = ["/auth/login", "/auth/register"];
    
    // Check if the current URL is public
    const isPublic = publicEndpoints.some((endpoint) => 
      config.url.includes(endpoint)
    );

    // Attach token only if it exists and URL is NOT public
    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Export the 'api' variable so other files can use it
export default api;