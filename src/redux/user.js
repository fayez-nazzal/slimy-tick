import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    name: '',
  },
  reducers: {
    login: (state, { payload }) => {
      const { email, name } = payload;
      state.email = email;
      state.name = name;
      localStorage.setItem('slimy-tick-jwt', state.userData.token);
    },
    logout: (state) => {
      state.userData = null;
      localStorage.removeItem('slimy-tick-jwt');
    },
  },
});

export const {
  login,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
