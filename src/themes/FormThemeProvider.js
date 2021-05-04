import React from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2dc065",
    },
    secondary: {
      main: "#bedc9b",
    },
  },
})

const FormThemeProvider = ({ children }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

export default FormThemeProvider
