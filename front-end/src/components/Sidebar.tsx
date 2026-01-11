// components/Sidebar.tsx
import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const pagesByRole: Record<string, { label: string; path: string }[]> = {
  seller: [
    { label: "Продаж", path: "/sales" },
    { label: "Історія продажів", path: "/sales-history" },
  ],
  manager: [
    { label: "Продаж", path: "/sales" },
    { label: "Історія продажів", path: "/sales-history" },
    { label: "Продукти", path: "/products" },
    { label: "Матеріали", path: "/materials" },
  ],
  owner: [
    { label: "Продаж", path: "/sales" },
    { label: "Історія продажів", path: "/sales-history" },
    { label: "Продукти", path: "/products" },
    { label: "Матеріали", path: "/materials" },
    { label: "Користувачі", path: "/users" },
  ],
};

interface SidebarProps {
  role: "seller" | "manager" | "owner";
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pages = pagesByRole[role] || [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List>
        {pages.map((page) => (
          <ListItemButton
            key={page.path}
            selected={location.pathname === page.path}
            onClick={() => navigate(page.path)}
          >
            <ListItemText primary={page.label} />
          </ListItemButton>
        ))}
      </List>

      <Box p={2}>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={handleLogout}
        >
          Вихід
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
