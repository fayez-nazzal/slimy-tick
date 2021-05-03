import React from "react"
import ReduxProvider from "./redux/provider"
import ApolloProvider from "./apollo/provider"
import MuiPickersUtilsProvider from "./MuiPickerUtilsProvider"
import momentUtils from "@date-io/moment"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"

const baseTheme = createMuiTheme()

export const wrapRootElement = ({ element }) => {
  return (
    <ReduxProvider>
      <ApolloProvider>
        <MuiPickersUtilsProvider utils={momentUtils}>
          <ThemeProvider theme={baseTheme}>{element}</ThemeProvider>
        </MuiPickersUtilsProvider>
      </ApolloProvider>
    </ReduxProvider>
  )
}

export default wrapRootElement
