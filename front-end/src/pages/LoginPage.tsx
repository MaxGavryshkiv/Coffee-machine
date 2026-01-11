// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { login } from "../services/authService";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        refreshUser(); // оновлюємо роль!
        navigate("/sales"); // або будь-який маршрут
      } else {
        setError("Невірна пошта або пароль");
      }
    } catch (err) {
      setError("Сталася помилка при вході");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10}>
        <Typography variant="h5" align="center">
          Вхід
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleLogin}
        >
          Увійти
        </Button>
      </Box>
    </Container>
  );
}
