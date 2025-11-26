import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "owner" | "manager" | "seller";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    role: "seller",
  });
  const [editMode, setEditMode] = useState(false);

  const fetchUsers = () => {
    fetch("http://localhost:3030/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Невірний формат відповіді:", data);
          setUsers([]); // щоб не зламалося
        }
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (editMode && form._id) {
      await fetch(`http://localhost:3030/users/${form._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify(form),
      });
    } else {
      const { _id, ...userToCreate } = form;
      await fetch("http://localhost:3030/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userToCreate),
      });
    }
    setOpen(false);
    fetchUsers();
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Користувачі
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Пошук за імʼям"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          onClick={() => {
            setEditMode(false);
            setForm({ name: "", email: "", role: "seller" });
            setOpen(true);
          }}
        >
          Додати користувача
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Імʼя</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Роль</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Редагувати</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user._id}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(true);
                    setForm(user);
                    setOpen(true);
                  }}
                >
                  Редагувати
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Редагування користувача" : "Додайте користувача"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Імʼя користувача"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Email адреса"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            margin="normal"
            value={form.password || ""}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Роль</InputLabel>
            <Select
              labelId="role-label"
              value={form.role}
              label="Роль"
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as User["role"] })
              }
            >
              <MenuItem value="owner">Власник</MenuItem>
              <MenuItem value="manager">Менеджер</MenuItem>
              <MenuItem value="seller">Продавець</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Скасувати</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? "Змінити" : "Додати"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
