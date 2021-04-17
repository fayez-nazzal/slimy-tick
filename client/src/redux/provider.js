import React from "react"
import store from "./store"
import { Provider as ReduxProvider } from "react-redux"

const Provider = ({ children }) => {
  return <ReduxProvider store={store}>{children}</ReduxProvider>
}

export default Provider
