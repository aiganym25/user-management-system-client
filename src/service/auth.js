import { config } from "../config";
import axios from "axios";

export const login = (values) => {
  const response = axios.post(config.API_URL_LOGIN, values);
  return response;
};

export const createUser = (values) => {
  const data = {
    name: values.name,
    email: values.email,
    password: values.password,
  };
  const response = axios.post(config.API_URL_REGISTER, data);
  return response;
};
