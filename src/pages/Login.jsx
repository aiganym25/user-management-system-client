import { Button, Card, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routesConfig";
import { login } from "../service/auth";
import "../styles/auth.css";
import { useDispatch } from "react-redux";
import { setAuthUserName } from "../stateManagement/authUsername";

export default function Login() {
  const [form] = Form.useForm();
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await login(values); // taking token
      if (res.data.error) {
        setLoginError(res.data.error);
      } else {
        localStorage.setItem("accessToken", res.data); // saving
        dispatch(setAuthUserName(values.email));
        setLoginError("");
        navigate(ROUTES.MAIN);
      }
    } catch (er) {
      setLoginError(
        "Login failed! Please check your password and email and try again."
      );
      navigate(ROUTES.LOGIN);
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = () => {
    navigate(ROUTES.REGISTER);
  };
  return (
    <Card className="auth-container">
      <p className="auth__title">Login</p>
      <Form
        form={form}
        className="auth-form"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          required={false}
          name="email"
          label={<label className="auth-form__title">Email</label>}
          validateStatus={loginError ? "error" : ""}
          rules={[
            {
              required: true,
              message: "Email is required!",
            },
          ]}
        >
          <Input
            placeholder="Enter your email"
            onChange={() => setLoginError("")}
          />
        </Form.Item>

        <Form.Item
          required={false}
          name="password"
          label={<label className="auth-form__title">Password</label>}
          validateStatus={loginError ? "error" : ""}
          rules={[
            {
              required: true,
              message: "Password is required",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your password"
            onChange={() => setLoginError("")}
          />
        </Form.Item>

        <div className="auth-form__error">{loginError} </div>

        <Form.Item>
          <Button
            className="auth-form__button"
            htmlType="submit"
            loading={loading}
          >
            Login
          </Button>
          <div className="auth-form__text">
            Don&apos;t have an account?
            <span className="auth-form__text--bold" onClick={goToSignUp}>
              Sign up
            </span>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}
