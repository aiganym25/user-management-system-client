import { configureStore } from "@reduxjs/toolkit";
import { authUsernameSlice } from "./authUsername";

const store = configureStore({
  reducer: {
    authUsername: authUsernameSlice.reducer,
  },
});
export default store;
