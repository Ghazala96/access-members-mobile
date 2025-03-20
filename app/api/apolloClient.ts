import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

import { RefreshTokenMutation } from './authMutations';

const httpLink = createHttpLink({
  uri: 'https://8340-41-38-30-52.ngrok-free.app/graphql' //TODO: Env variable
});

const authLink = setContext(async (_, { headers }) => {
  let token = await SecureStore.getItemAsync('accessToken');
  if (!token) {
    token = await refreshAccessToken();
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

export const refreshAccessToken = async () => {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) return null;

    const { data } = await client.mutate({
      mutation: RefreshTokenMutation,
      variables: { refreshToken }
    });
    const newAccessToken = data?.refreshToken?.accessToken || null;
    if (newAccessToken) {
      await SecureStore.setItemAsync('accessToken', newAccessToken);
    }

    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
};

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
