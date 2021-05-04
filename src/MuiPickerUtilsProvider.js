import React from "react"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import MomentUtils from "@date-io/moment"

const Provider = ({ children }) => {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      {children}
    </MuiPickersUtilsProvider>
  )
}

export default Provider
