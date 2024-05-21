import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = number ;

const initialState: UserState = 1;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
