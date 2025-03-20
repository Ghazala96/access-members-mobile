import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

import store from "./redux/store";
import client from "./api/apolloClient";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Stack screenOptions={{ headerShown: false }} />
      </ApolloProvider>
    </Provider>
  );
}
