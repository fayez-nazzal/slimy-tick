import { createSlice } from "@reduxjs/toolkit"
import { matchPriorityAndReturnRange } from "../utils/matchers"
import {
  findDueDateOptions,
  findDueTimeOptions,
  findRepeatOptions,
} from "../utils/regexAnalyzers"
import isEqual from "lodash.isequal"

const replaceRange = (str, start, end, substitute) => {
  return str.substring(0, start) + substitute + str.substring(end)
}

const getPriorityStrEquivelent = priority => {
  return priority === 4
    ? ""
    : priority === 3
    ? "!"
    : priority === 2
    ? "!!"
    : "!!!"
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
      dueDate: "",
      dueTime: "",
      repeat: "",
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
      const newPriority = getPriorityStrEquivelent(action.payload)

      // if old priority regex text exist, replace it to the new priority
      if (state.draftTodoValues.body) {
        const todoPriorityRange = matchPriorityAndReturnRange(
          state.draftTodoValues.body
        )

        state.draftTodoValues.body = replaceRange(
          state.draftTodoValues.body,
          todoPriorityRange[0],
          todoPriorityRange[1],
          newPriority
        )
      }

      state.draftTodoValues.priority = action.payload
    },
    setDraftTodoGroup: (state, action) => {
      state.draftTodoValues.groupName = action.payload.name
    },
    setDraftTodoDueDate: (state, action) => {
      const todoBody = state.draftTodoValues.body
      const todoDueDate = state.draftTodoValues.dueDate

      if (
        !todoBody.includes(action.payload) &&
        !findDueDateOptions(action.payload).isSame(
          findDueDateOptions(todoDueDate),
          "day"
        )
      )
        state.draftTodoValues.body =
          todoBody && todoDueDate
            ? todoBody.replace(todoDueDate, action.payload)
            : todoBody

      state.draftTodoValues.dueDate = action.payload
    },
    setDraftTodoDueTime: (state, action) => {
      const todoBody = state.draftTodoValues.body
      const todoDueTime = state.draftTodoValues.dueTime

      if (
        todoDueTime &&
        todoBody &&
        !todoBody.includes(action.payload) &&
        !findDueTimeOptions(action.payload).isSame(
          findDueTimeOptions(todoDueTime),
          "hour"
        )
      )
        state.draftTodoValues.body = todoBody.replace(
          todoDueTime,
          action.payload
        )

      state.draftTodoValues.dueTime = action.payload
    },
    setDraftTodoRepeat: (state, action) => {
      const todoBody = state.draftTodoValues.body
      const oldRepeat = state.draftTodoValues.repeat
      const analyzedOldRepeat = findRepeatOptions(oldRepeat)
      const newRepeat =
        action.payload && action.payload[0] ? action.payload : ""
      const analyzedNewRepeat = findRepeatOptions(newRepeat)

      if (
        todoBody &&
        oldRepeat &&
        !todoBody.includes(newRepeat) &&
        !isEqual(analyzedOldRepeat, analyzedNewRepeat)
      )
        state.draftTodoValues.body = todoBody.replace(oldRepeat, newRepeat)

      state.draftTodoValues.repeat = newRepeat
    },
    addTodo: (state, action) => {
      const group = state.userData.groups[state.groupIndex]
      group.todos = [...group.todos, action.payload]
    },
    setGroups: (state, action) => {
      state.userData.groups = action.payload
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
  setDraftTodoDueTime,
  setDraftTodoRepeat,
  setGroups,
} = userSlice.actions

export default userSlice.reducer
