import React from "react"
import ReduxProvider from "./redux/provider"
import ApolloProvider from "./apollo/provider"
import MuiPickersUtilsProvider from "./MuiPickerUtilsProvider"

export const wrapRootElement = ({ element }) => {
  return (
    <ReduxProvider>
      <ApolloProvider>
        <MuiPickersUtilsProvider>{element}</MuiPickersUtilsProvider>
      </ApolloProvider>
    </ReduxProvider>
  )
}
