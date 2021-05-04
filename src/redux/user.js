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
    drafttaskValues: {
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
    setDrafttaskBody: (state, action) => {
      state.drafttaskValues.body = action.payload
    },
    setDrafttaskPriority: (state, action) => {
      const newPriority = getPriorityStrEquivelent(action.payload)

      // if old priority regex text exist, replace it to the new priority
      if (state.drafttaskValues.body) {
        const taskPriorityRange = matchPriorityAndReturnRange(
          state.drafttaskValues.body
        )

        state.drafttaskValues.body = replaceRange(
          state.drafttaskValues.body,
          taskPriorityRange[0],
          taskPriorityRange[1],
          newPriority
        )
      }

      state.drafttaskValues.priority = action.payload
    },
    setDrafttaskGroup: (state, action) => {
      state.drafttaskValues.groupName = action.payload.name
    },
    setDrafttaskDueDate: (state, action) => {
      const taskBody = state.drafttaskValues.body
      const taskDueDate = state.drafttaskValues.dueDate

      if (
        !taskBody.includes(action.payload) &&
        !findDueDateOptions(action.payload).isSame(
          findDueDateOptions(taskDueDate),
          "day"
        )
      )
        state.drafttaskValues.body =
          taskBody && taskDueDate
            ? taskBody.replace(taskDueDate, action.payload)
            : taskBody

      state.drafttaskValues.dueDate = action.payload
    },
    setDrafttaskDueTime: (state, action) => {
      const taskBody = state.drafttaskValues.body
      const taskDueTime = state.drafttaskValues.dueTime

      if (
        taskDueTime &&
        taskBody &&
        !taskBody.includes(action.payload) &&
        !findDueTimeOptions(action.payload).isSame(
          findDueTimeOptions(taskDueTime),
          "hour"
        )
      )
        state.drafttaskValues.body = taskBody.replace(
          taskDueTime,
          action.payload
        )

      state.drafttaskValues.dueTime = action.payload
    },
    setDrafttaskRepeat: (state, action) => {
      const taskBody = state.drafttaskValues.body
      const oldRepeat = state.drafttaskValues.repeat
      const analyzedOldRepeat = findRepeatOptions(oldRepeat)
      const newRepeat =
        action.payload && action.payload[0] ? action.payload : ""
      const analyzedNewRepeat = findRepeatOptions(newRepeat)

      if (
        taskBody &&
        oldRepeat &&
        !taskBody.includes(newRepeat) &&
        !isEqual(analyzedOldRepeat, analyzedNewRepeat)
      )
        state.drafttaskValues.body = taskBody.replace(oldRepeat, newRepeat)

      state.drafttaskValues.repeat = newRepeat
    },
    addtask: (state, action) => {
      const group = state.userData.groups[state.groupIndex]
      group.tasks = [...group.tasks, action.payload]
    },
    setGroups: (state, action) => {
      state.userData.groups = action.payload
    },
  },
})

export const {
  login,
  logout,
  addtask,
  setGroupIndex,
  setDrafttaskBody,
  setDrafttaskPriority,
  setDrafttaskGroup,
  setDrafttaskDueDate,
  setDrafttaskDueTime,
  setDrafttaskRepeat,
  setGroups,
} = userSlice.actions

export default userSlice.reducer
