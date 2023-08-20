import axios from "axios";
import { config } from "../config";

export const onDelete = async (keys) => {
  const res = await axios.post(config.API_URL_DELETE, keys);
  return res;
};

export const onBlock = async (keys) => {
  const res = await axios.post(config.API_URL_BLOCK, keys);
  return res;
};
export const onUnBlock = async (keys) => {
  const res = await axios.post(config.API_URL_UNBLOCK, keys);
  return res;
};
