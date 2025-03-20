import { Stack } from "expo-router";

import Header from "@/app/components/Header";

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <Header title="Orders" />,
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "Order Details" }} />
    </Stack>
  );
}