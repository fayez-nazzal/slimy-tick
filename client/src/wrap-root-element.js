import React from "react"
import ReduxProvider from "./redux/provider"
import ApolloProvider from "./apollo/provider"
import MuiPickersUtilsProvider from "./MuiPickerUtilsProvider"
import momentUtils from "@date-io/moment"

export const wrapRootElement = ({ element }) => {
  return (
    <ReduxProvider>
      <ApolloProvider>
        <MuiPickersUtilsProvider utils={momentUtils}>
          {element}
        </MuiPickersUtilsProvider>
      </ApolloProvider>
    </ReduxProvider>
  )
}

export default wrapRootElement
