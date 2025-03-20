import { Stack } from "expo-router";

import Header from "@/app/components/Header";

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <Header title="Events" />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Events" }} />
      <Stack.Screen name="[id]" options={{ title: "Event Details" }} />
    </Stack>
  );
}