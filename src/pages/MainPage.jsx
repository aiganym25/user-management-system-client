import "../styles/mainPage.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routesConfig";
import UserTable from "../components/UserTable";
import { useDispatch } from "react-redux";
import { setAuthUserName } from "../stateManagement/authUsername";

export default function MainPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signOut = () => {
    localStorage.removeItem("accessToken");
    dispatch(setAuthUserName(""));
    navigate(ROUTES.LOGIN);
  };
  return (
    <div>
      <div className="sign-out-btn" onClick={signOut}>
        Sign out
      </div>
      <UserTable />
    </div>
  );
}
