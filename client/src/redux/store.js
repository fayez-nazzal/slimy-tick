import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./user"
import appReducer from "./app"

const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
  },
  devTools: true,
})

export default store
