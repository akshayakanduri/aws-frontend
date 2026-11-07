const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://github-clone-backend-xyfr.onrender.com"
).replace(/\/+$/, "");

export default API_BASE_URL;