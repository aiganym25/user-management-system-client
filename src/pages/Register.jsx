import { Button, Card, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routesConfig";
import { createUser } from "../service/auth";
import { getUsers } from "../service/users";
import { useDispatch } from "react-redux";
import { setAuthUserName } from "../stateManagement/authUsername";

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [signUpError, setSignUpError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const goToLoginPage = () => {
    navigate(ROUTES.LOGIN);
  };

  const validateEmail = async () => {
    const values = await form.validateFields(["email"]);
    // Valid email format
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(values.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");

    // email existence
    const users = await getUsers();

    if (users) {
      const emailExists = users.some((user) => user.email === values.email);
      if (emailExists) {
        setEmailError("This email is already registered.");
        return;
      } else {
        setEmailError("");
      }
    }
  };

  const validatePasswordMatch = async () => {
    const password = await form.validateFields(["password"]);
    const confirmPassword = await form.validateFields(["confirmPassword"]);

    if (password.password !== confirmPassword.confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    } else {
      setPasswordMatchError("");
    }
  };

  const onFinish = async (values) => {
    if (!emailError && !passwordMatchError) {
      try {
        setLoading(true);
        setSignUpError("");
        const res = await createUser(values);
        if (res.data.error) {
          setEmailError(res.data.error);
        } else {
          localStorage.setItem("accessToken", res.data);
          dispatch(setAuthUserName(values.email));
          setEmailError("");
          navigate(ROUTES.MAIN);
        }
      } catch (error) {
        setSignUpError("Sign up failed! Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <Card className="auth-container">
      <p className="auth__title">Sign up</p>
      <Form
        form={form}
        className="auth-form"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          required={false}
          name="name"
          label={<label className="auth-form__title">Name</label>}
          validateStatus={signUpError ? "error" : ""}
          rules={[
            {
              required: true,
              message: "Name is required!",
            },
          ]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          required={false}
          name="email"
          label={<label className="auth-form__title">Email</label>}
          validateStatus={signUpError || emailError ? "error" : ""}
          help={emailError}
          rules={[
            {
              required: true,
              message: "Email is required!",
            },
          ]}
        >
          <Input placeholder="Enter your email" onBlur={validateEmail} />
        </Form.Item>

        <Form.Item
          required={false}
          name="password"
          label={<label className="auth-form__title">Password</label>}
          validateStatus={signUpError ? "error" : ""}
          rules={[
            {
              required: true,
              message: "Password is required",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your password"
            // onBlur={validatePassword}
          />
        </Form.Item>

        <Form.Item
          required={false}
          name="confirmPassword"
          label={<label className="auth-form__title">Repeat Password</label>}
          validateStatus={signUpError || passwordMatchError ? "error" : ""}
          help={passwordMatchError}
          rules={[
            {
              required: true,
              message: "Please confirm your password",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your password again"
            onChange={validatePasswordMatch}
          />
        </Form.Item>

        <div className="auth-form__error">{signUpError} </div>

        <Form.Item>
          <Button
            className="auth-form__button"
            htmlType="submit"
            loading={loading}
          >
            Create Account
          </Button>
          <div className="auth-form__text">
            Already have an account?
            <span className="auth-form__text--bold" onClick={goToLoginPage}>
              Log in
            </span>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}
