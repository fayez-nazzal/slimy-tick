import { createSlice } from "@reduxjs/toolkit"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    duePickerOpen: false,
  },
  reducers: {
    toggleDuePicker: state => {
      state.duePickerOpen = !state.duePickerOpen
    },
  },
})

export const { toggleDuePicker } = appSlice.actions

export default appSlice.reducer
