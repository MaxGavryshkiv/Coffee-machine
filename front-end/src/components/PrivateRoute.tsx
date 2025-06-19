// components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
interface PrivateRouteProps {
  children: React.ReactNode;
}
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
