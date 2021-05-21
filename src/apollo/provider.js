import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
} from '@apollo/client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from 'apollo-link-retry';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

let client;

const Provider = ({ children }) => {
  const [apolloClient, setApolloCLient] = useState();

  useLayoutEffect(() => {
    const init = async () => {
      const httpLink = createHttpLink({
        uri: 'http://localhost:5000/graphql',
        credentials: 'include',
      });

      const retryLink = new RetryLink({ attempts: { max: Infinity } });

      const authLink = setContext(() => {
        const token = localStorage.getItem('slimy-tick-jwt');

        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        };
      });

      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
      });

      client = new ApolloClient({
        link: ApolloLink.from([
          retryLink,
          httpLink,
          authLink,
        ]),
        cache,
      });

      setApolloCLient(client);
    };

    init();
  }, []);

  return apolloClient ? <ApolloProvider client={apolloClient}>{children}</ApolloProvider> : null;
};

export const getClient = () => client;

export default Provider;
