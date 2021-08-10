import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import counterReducer from "./counter";

// we need one main reducer
// will merge all reducers into one big reducer
const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
  },
  // reducer: { counterSlice: counterSlice.reducer },
});


export default store;

