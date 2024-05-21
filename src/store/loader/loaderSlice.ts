import { createSlice } from "@reduxjs/toolkit";

type LoaderState = boolean;

const initialState: LoaderState = false;

const loaderSlice = createSlice({
  name: "loaderState",
  initialState,
  reducers: {
    setIsLoading: () => {
      return true;
    },
    setIsNotLoading: () => {
      return false;
    },
  },
});

export const { setIsLoading, setIsNotLoading } = loaderSlice.actions;

export default loaderSlice.reducer;
