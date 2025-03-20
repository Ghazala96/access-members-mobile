import { Stack } from "expo-router";
import Header from "@/app/components/Header";

export default function CartLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => (
          <Header title="Your Cart" />
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Cart" }} />
    </Stack>
  );
}
