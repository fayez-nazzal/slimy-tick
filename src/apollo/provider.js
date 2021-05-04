import React from "react"
import {
  ApolloClient,
  createHttpLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client"
import fetch from "isomorphic-fetch"
import { setContext } from "@apollo/client/link/context"

const httpLink = createHttpLink({
  uri: "http://localhost:5000/",
  fetch,
})

const authLink = setContext(() => {
  const token = localStorage.getItem("slimy-tick-jwt")

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

const Provider = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
)

export default Provider
