import { createSlice } from "@reduxjs/toolkit"
import { findDueDateOptions } from "../utils/regexAnalyzers"

const getIsoFromDate = dateStr => {
  return dateStr && findDueDateOptions(dateStr).toISOString()
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    groupIndex: null,
    draftTodoValues: {
      body: "",
      priority: 4,
      groupName: null,
      dueISO: "",
      dueDate: "",
      dueTime: "",
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
    setDraftTodoDueDate: (state, action) => {
      state.draftTodoValues.dueDate = action.payload
      state.draftTodoValues.dueISO = getIsoFromDate(action.payload)
    },
    setDraftTodoDueDateByPicker: (state, action) => {
      const todoBody = state.draftTodoValues.body
      const todoDueDate = state.draftTodoValues.dueDate

      state.draftTodoValues.dueDate = action.payload
      state.draftTodoValues.body = todoBody.replace(todoDueDate, action.payload)
      state.draftTodoValues.dueISO = getIsoFromDate(action.payload)
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
  setDraftTodoDueDate,
  setDraftTodoDueDateByPicker,
} = userSlice.actions

export default userSlice.reducer
