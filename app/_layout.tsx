import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

import store from "./redux/store";
import client from "./api/apolloClient";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="features/auth/register" options={{ title: "Register" }}/>
          <Stack.Screen name="features/auth/login" options={{ title: "Login" }}/>
          <Stack.Screen name="features/dashboard/index" options={{ title: "Dashboard" }} />
          <Stack.Screen name="features/events/index" options={{ title: "Events" }} />
          <Stack.Screen name="features/events/[id]" options={{ title: "Event Details" }} />
        </Stack>
      </ApolloProvider>
    </Provider>
  );
}
