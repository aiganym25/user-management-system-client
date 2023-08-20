import axios from "axios";
import { config } from "../config";

export const getUsers = async () => {
  const users = await axios.get(config.API_URL_USERS);
  return users.data;
};
