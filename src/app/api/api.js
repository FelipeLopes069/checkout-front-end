// api/api.js
import axios from "axios";

const baseURL = "https://coloured-siana-fynancce-v2-8cb1dd20.koyeb.app";

const instance = axios.create({
  baseURL,
});

// Interceptor para adicionar token JWT automaticamente
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  get: (url) => instance.get(url).then(res => res.data),
  post: (url, body) => instance.post(url, body).then(res => res.data),
  put: (url, body) => instance.put(url, body).then(res => res.data),
  delete: (url) => instance.delete(url).then(res => res.data),
  upload: (url, formData) =>
    instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(res => res.data),
};