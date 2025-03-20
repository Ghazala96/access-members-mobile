import { Stack } from "expo-router";

import Header from "../../components/Header";

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <Header title="Dashboard" />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
    </Stack>
  );
}
