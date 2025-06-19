// layouts/MainLayout.tsx
import React from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "../components/Sidebar";

interface Props {
  role: "seller" | "manager" | "owner";
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ role, children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role={role} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* для відступу під AppBar, якщо буде */}
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
