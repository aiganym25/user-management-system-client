import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ROUTES } from "./routes/routesConfig";
import MainPage from "./pages/MainPage";
import { Provider } from "react-redux";
import store from "./stateManagement/store";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path={ROUTES.MAIN} element={<ProtectedRoutes />}>
            <Route path={ROUTES.MAIN} element={<MainPage />} />
          </Route>

          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path="*" element={<Navigate to={ROUTES.NOTFOUND} />} />
          <Route path={ROUTES.NOTFOUND} element={<PageNotFound />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
