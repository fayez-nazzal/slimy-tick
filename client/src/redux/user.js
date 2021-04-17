import { createSlice } from "@reduxjs/toolkit"

export const authSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    groupIndex: null,
  },
  reducers: {
    login: (state, action) => {
      state.userData = action.payload
      localStorage.setItem("slimy-tick-jwt", state.userData.token)
      state.groupIndex = 0
    },
    logout: state => {
      state.userData = null
      localStorage.removeItem("slimy-tick-jwt")
    },
    setGroupIndex: (state, action) => {
      state.groupIndex = action.payload
    },
    addTodo: (state, action) => {
      const group = state.userData.groups[state.groupIndex]
      group.todos = [...group.todos, action.payload]
    },
  },
})

export const { login, logout, addTodo, setGroupIndex } = authSlice.actions

export default authSlice.reducer
