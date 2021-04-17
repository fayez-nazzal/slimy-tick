import React from "react"
import ReduxProvider from "./redux/provider"
import ApolloProvider from "./apollo/provider"

export const wrapRootElement = ({ element }) => {
  return (
    <ReduxProvider>
      <ApolloProvider>{element}</ApolloProvider>
    </ReduxProvider>
  )
}
