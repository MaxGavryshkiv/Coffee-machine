// utils/decodeToken.ts
import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    console.log(jwtDecode(token));
    return jwtDecode(token) as { email: string; role: string };
  } catch {
    return null;
  }
};
