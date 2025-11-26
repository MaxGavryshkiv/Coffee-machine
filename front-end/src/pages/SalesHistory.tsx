import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface SaleItem {
  product: {
    name: string;
  };
  pricePerUnit: number;
  quantity: number;
}

interface Sale {
  totalAmount: number;
  _id: string;
  seller: {
    name: string;
  };
  items: SaleItem[];
  total: number;
  createdAt: string;
}

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  useEffect(() => {
    fetch("http://localhost:3030/sales", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Отримані продажі:", data); // <--- додай
        setSales(data);
      });
  }, []);

  const filteredSales = sales.filter((sale) =>
    sale.seller.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Історія продажів
      </Typography>
      <Box display="flex" mb={2}>
        <TextField
          label="Пошук за імʼям продавця"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Імʼя продавця</TableCell>
            <TableCell>Назви товарів</TableCell>
            <TableCell>Сума</TableCell>
            <TableCell>Час продажу</TableCell>
            <TableCell>Детальніше</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSales.map((sale) => {
            const productNames = sale.items
              .map((item) => item.product.name)
              .join(", ");
            const shortName =
              productNames.length > 15
                ? `${productNames.slice(0, 15)}...`
                : productNames;

            return (
              <TableRow key={sale._id}>
                <TableCell>{sale.seller.name}</TableCell>
                <TableCell>
                  <Tooltip title={productNames} arrow>
                    <span>{shortName}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {typeof sale.totalAmount === "number"
                    ? sale.totalAmount.toFixed(2)
                    : "—"}{" "}
                  грн
                </TableCell>
                <TableCell>
                  {new Date(sale.createdAt).toLocaleString("uk-UA")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedSale(sale)}
                  >
                    Детальніше
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog
        open={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Детальна інформація про продаж</DialogTitle>
        <DialogContent>
          {selectedSale && (
            <Box>
              <Typography>Продавець: {selectedSale.seller.name}</Typography>
              <Typography>
                Час: {new Date(selectedSale.createdAt).toLocaleString("uk-UA")}
              </Typography>
              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Назва</TableCell>
                    <TableCell>Ціна</TableCell>
                    <TableCell>Кількість</TableCell>
                    <TableCell>Сума</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedSale.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.pricePerUnit.toFixed(2)} грн</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {(item.pricePerUnit * item.quantity).toFixed(2)} грн
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography mt={2} fontWeight="bold">
                Загальна сума:{" "}
                {typeof selectedSale.totalAmount === "number"
                  ? selectedSale.totalAmount.toFixed(2)
                  : "—"}{" "}
                грн
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSale(null)}>Закрити</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
