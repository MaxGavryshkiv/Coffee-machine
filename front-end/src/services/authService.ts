// authService.ts
export function login(email: string, password: string) {
  return fetch("http://localhost:3030/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }
      return data;
    });
}
