import api from "./api";

/**
 * POST /api/auth/register — no requiere JWT
 */
export async function registerUser({ name, email, password }) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
}

/**
 * POST /api/auth/login — no requiere JWT
 * Se espera { token, user } como respuesta.
 */
export async function loginUser({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}
