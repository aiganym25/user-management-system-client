import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  authUsername: "",
};

export const authUsernameSlice = createSlice({
  name: "authUsername",
  initialState,
  reducers: {
    setAuthUserName: (state, action) => {
      state.authUsername = action.payload;
    },
  },
});

export default authUsernameSlice.reducer;
export const { setAuthUserName } = authUsernameSlice.actions;
