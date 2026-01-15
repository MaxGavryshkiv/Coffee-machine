import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

interface Material {
  _id: string;
  name: string;
  quantity: number;
  unit: "грам" | "шт" | "мл";
  category: string;
}

const MaterialsPage = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<Material>>({
    name: "",
    quantity: 0,
    unit: "грам",
    category: "",
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const res = await fetch("http://localhost:3030/material");
    const data = await res.json();
    setMaterials(data);
  };

  const handleOpen = (material?: Material) => {
    if (material) {
      setEditMode(true);
      setForm(material);
    } else {
      setEditMode(false);
      setForm({ name: "", quantity: 0, unit: "грам", category: "" });
    }
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);

  const handleSubmit = async () => {
    if ((form.quantity as number) < 0) {
      alert("Кількість не може бути від’ємною");
      return;
    }
    if (editMode && form._id) {
      await fetch(`http://localhost:3030/material/${form._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("http://localhost:3030/material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    (document.activeElement as HTMLElement)?.blur();
    handleClose();
    fetchMaterials();
  };
  const handleDelete = async () => {
    if (editMode && form._id) {
      await fetch(`http://localhost:3030/material/${form._id}`, {
        method: "DELETE",
      });
    }

    (document.activeElement as HTMLElement)?.blur();
    handleClose();
    fetchMaterials();
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m._id.includes(search)
  );

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px 0",
        }}
      >
        <TextField
          sx={{ width: 500 }}
          label="Пошук за назвою або ID"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={() => handleOpen()}>
          Додати матеріал
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Матеріали</TableCell>
            <TableCell>Кількість</TableCell>
            <TableCell>Категорія</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMaterials.map((material) => (
            <TableRow key={material._id}>
              <TableCell>{material.name}</TableCell>
              <TableCell>
                {material.quantity} {material.unit}
              </TableCell>
              <TableCell>{material.category}</TableCell>
              <TableCell>{material._id}</TableCell>
              <TableCell>
                <Button onClick={() => handleOpen(material)}>Редагувати</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>
          {editMode ? "Редагувати матеріал" : "Додати матеріал"}
        </DialogTitle>
        <DialogContent sx={{ width: 900, height: 300 }}>
          <TextField
            sx={{ width: 500 }}
            label="Назва товару"
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <TextField
              sx={{ width: 300 }}
              label="Кількість"
              type="number"
              slotProps={{
                input: {
                  inputProps: { min: 0 },
                },
              }}
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
            />
            <FormControl>
              <InputLabel>Одиниця</InputLabel>
              <Select
                label="Одиниця"
                sx={{ width: 185 }}
                value={form.unit}
                onChange={(e) =>
                  setForm({ ...form, unit: e.target.value as Material["unit"] })
                }
              >
                <MenuItem value="грам">грам</MenuItem>
                <MenuItem value="шт">шт</MenuItem>
                <MenuItem value="мл">мл</MenuItem>
              </Select>
            </FormControl>
          </div>
          <TextField
            label="Категорія"
            sx={{ width: 500 }}
            margin="normal"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          {editMode ? (
            <Button
              onClick={handleDelete}
              variant="contained"
              sx={{ backgroundColor: "tomato" }}
            >
              Видалити
            </Button>
          ) : (
            ""
          )}
          <Button onClick={handleClose}>Скасувати</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? "Підтвердити зміни" : "Додати"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MaterialsPage;
