import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    groupIndex: null,
    draftTodoValues: {
      body: "",
      priority: 4,
      groupName: "default",
    },
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
    setDraftTodoBody: (state, action) => {
      state.draftTodoValues.body = action.payload
    },
    setDraftTodoPriority: (state, action) => {
      state.draftTodoValues.priority = action.payload
    },
    setDraftTodoGroup: (state, action) => {
      state.draftTodoValues.groupName = action.payload.name
    },
    addTodo: (state, action) => {
      const group = state.userData.groups[state.groupIndex]
      group.todos = [...group.todos, action.payload]
    },
  },
})

export const {
  login,
  logout,
  addTodo,
  setGroupIndex,
  setDraftTodoBody,
  setDraftTodoPriority,
  setDraftTodoGroup,
} = userSlice.actions

export default userSlice.reducer
