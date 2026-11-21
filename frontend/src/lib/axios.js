import axios from "axios";

export const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.MODE === "development" ? "http://localhost:5000" : "")
).replace(/\/+$/, "");

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL ? `${BACKEND_URL}/api` : "/api",
  withCredentials: true,
});
