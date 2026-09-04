// "Recordarme en este equipo" del login decide el storage: localStorage
// sobrevive a cerrar el navegador, sessionStorage se borra al cerrar la
// pestaña. Nunca se guarda en los dos a la vez para no dejar un token
// colgado en el storage que el usuario no eligió.
const TOKEN_KEY = "platita:token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, remember = true): void {
  clearToken();
  (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}
