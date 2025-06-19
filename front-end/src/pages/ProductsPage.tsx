// src/pages/ProductsPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Material {
  _id: string;
  name: string;
  unit: string;
}

interface RecipeItem {
  materialId: string;
  name: string;
  quantity: number;
  unit: string;
}

interface Product {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  recipe: RecipeItem[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Product>({
    _id: "",
    name: "",
    price: 0,
    quantity: 0,
    recipe: [],
  });

  useEffect(() => {
    fetchProducts();
    fetchMaterials();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3030/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchMaterials = async () => {
    const res = await fetch("http://localhost:3030/material");
    const data = await res.json();
    setMaterials(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectMaterial = (e: SelectChangeEvent<string[]>) => {
    const selectedIds = e.target.value as string[];
    const newRecipe = selectedIds
      .map((id) => {
        const mat = materials.find((m) => m._id === id);
        return mat
          ? { materialId: mat._id, name: mat.name, quantity: 1, unit: mat.unit }
          : null;
      })
      .filter(Boolean) as RecipeItem[];
    setForm({ ...form, recipe: newRecipe });
  };

  const handleRecipeChange = <K extends keyof RecipeItem>(
    index: number,
    key: K,
    value: RecipeItem[K]
  ) => {
    const newRecipe = [...form.recipe];
    newRecipe[index][key] = value;
    setForm({ ...form, recipe: newRecipe });
  };

  const handleDeleteMaterial = (index: number) => {
    const newRecipe = form.recipe.filter((_, i) => i !== index);
    setForm({ ...form, recipe: newRecipe });
  };

  const handleSubmit = async () => {
    if ((form.quantity as number) < 0) {
      alert("Кількість не може бути від’ємною");
      return;
    }
    if ((form.price as number) < 0.1) {
      alert("Ціна не може бути нижче 0.1");
      return;
    }

    if (editMode) {
      await fetch(`http://localhost:3030/products/${form._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      const { _id, ...formWithoutId } = form;

      await fetch("http://localhost:3030/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formWithoutId),
      });
    }
    fetchProducts();
    handleClose();
  };

  const handleDeleteProduct = async () => {
    await fetch(`http://localhost:3030/products/${form._id}`, {
      method: "DELETE",
    });
    fetchProducts();
    handleClose();
  };

  const handleEdit = (product: Product) => {
    setEditMode(true);
    setForm(product);
    setOpen(true);
  };

  const handleClose = () => {
    setEditMode(false);
    setForm({ _id: "", name: "", price: 0, quantity: 0, recipe: [] });
    setOpen(false);
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          placeholder="Пошук"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" onClick={() => setOpen(true)}>
          Додати товар
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Товари</TableCell>
            <TableCell>Кількість</TableCell>
            <TableCell>Ціна</TableCell>
            <TableCell>Матеріали</TableCell>
            <TableCell>Id</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products
            .filter(
              (p) =>
                p._id && (p.name.includes(search) || p._id.includes(search))
            )
            .map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>
                  <Tooltip title={p.recipe.map((r) => r.name).join(", ")}>
                    <Typography>
                      {p.recipe
                        .map((r) => r.name)
                        .join(", ")
                        .slice(0, 15)}
                      {p.recipe.map((r) => r.name).join(", ").length > 15
                        ? "..."
                        : ""}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{p._id}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(p)}>Редагувати</Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          {editMode ? "Редагувати товар" : "Додати товар"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Назва"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Ціна"
            name="price"
            type="number"
            fullWidth
            value={form.price}
            onChange={handleChange}
            margin="normal"
            slotProps={{
              input: {
                inputProps: { min: 0 },
              },
            }}
          />
          <TextField
            label="Кількість"
            name="quantity"
            type="number"
            fullWidth
            value={form.quantity}
            onChange={handleChange}
            margin="normal"
            slotProps={{
              input: {
                inputProps: { min: 0 },
              },
            }}
          />
          <Select
            multiple
            fullWidth
            value={form.recipe.map((r) => r.materialId)}
            onChange={handleSelectMaterial}
            displayEmpty
            renderValue={(selected) =>
              (selected as string[])
                .map((id) => materials.find((m) => m._id === id)?.name)
                .join(", ")
            }
            sx={{ my: 2 }}
          >
            {materials.map((m) => (
              <MenuItem key={m._id} value={m._id}>
                {m.name}
              </MenuItem>
            ))}
          </Select>

          {form.recipe.map((r, i) => (
            <Box key={i} display="flex" alignItems="center" gap={1} my={1}>
              <Typography>{r.name}</Typography>
              <TextField
                type="number"
                value={r.quantity}
                onChange={(e) =>
                  handleRecipeChange(i, "quantity", +e.target.value)
                }
                sx={{ width: 100 }}
              />
              <Select
                value={r.unit}
                onChange={(e) => handleRecipeChange(i, "unit", e.target.value)}
              >
                <MenuItem value="грам">грам</MenuItem>
                <MenuItem value="шт">шт</MenuItem>
                <MenuItem value="мл">мл</MenuItem>
              </Select>
              <Button onClick={() => handleDeleteMaterial(i)}>Видалити</Button>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          {editMode && (
            <Button color="error" onClick={handleDeleteProduct}>
              Видалити
            </Button>
          )}
          <Button onClick={handleClose}>Скасувати</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? "Підтвердити зміни" : "Додати"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
