import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routesConfig";
// import { ROUTES } from "./routesConfig";

export default function ProtectedRoutes() {
  const useAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      return true;
    } else {
      return false;
    }
  };
  const auth = useAuth();

  return (auth ? <Outlet /> : <Navigate to={ROUTES.LOGIN} />)
}
