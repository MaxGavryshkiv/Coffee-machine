import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItem extends Product {
  saleQuantity: number;
}

interface SalesPageProps {
  userId?: string;
}

export default function SalesPage({ userId }: SalesPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3030/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p._id.includes(searchTerm)
  );

  const handleAddToCart = (product: Product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (!existing) {
      setCart([...cart, { ...product, saleQuantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (id: string, value: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, saleQuantity: value } : item
      )
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.saleQuantity,
    0
  );

  const handleRegisterSale = async () => {
    const sellerId = userId;

    const items = cart.map((item) => ({
      product: item._id,
      quantity: item.saleQuantity,
      pricePerUnit: item.price,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.pricePerUnit * item.quantity,
      0
    );

    const saleData = {
      seller: sellerId,
      items,
      totalAmount,
    };

    try {
      console.log(saleData);
      const res = await fetch("http://localhost:3030/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(saleData),
      });

      if (!res.ok) {
        throw new Error("Не вдалося зареєструвати продаж");
      }

      setCart([]);
      setIsCartOpen(false);
    } catch (err) {
      console.error("Помилка при реєстрації продажу:", err);
    }
  };

  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Paper sx={{ display: "flex", alignItems: "center", width: 300 }}>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Пошук"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ ml: 1, flex: 1 }}
          />
        </Paper>
        <Button variant="contained" onClick={() => setIsCartOpen(true)}>
          Кошик
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Товари</TableCell>
              <TableCell>Кількість</TableCell>
              <TableCell>Ціна</TableCell>
              <TableCell>Дія</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    variant="outlined"
                  >
                    Додати в кошик
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Кошик</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Назва</TableCell>
                <TableCell>Кількість</TableCell>
                <TableCell>Ціна</TableCell>
                <TableCell>Загалом</TableCell>
                <TableCell>Вилучити</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Select
                      value={item.saleQuantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item._id, Number(e.target.value))
                      }
                    >
                      {Array.from(
                        { length: item.quantity },
                        (_, i) => i + 1
                      ).map((n) => (
                        <MenuItem key={n} value={n}>
                          {n}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.price * item.saleQuantity}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRemoveFromCart(item._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography variant="h6" mt={2}>
            Сума: {total} грн
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCartOpen(false)}>Скасувати</Button>
          <Button onClick={handleRegisterSale} variant="contained">
            Зареєструвати продажу
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
