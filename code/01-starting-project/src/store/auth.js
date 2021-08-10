import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;


// reducers will automatically received current/latest state
// we are allowed to mutate state directly in reducer functions
//      - in redux toolkit its ok to modify state because it
//         uses Immer package iternally  (auto clones existing state - makes new state)
// allows you to change just the code you want, a

// action creators - create actions
// already have a type property
// counterSlice.actions.toggleCounter;
