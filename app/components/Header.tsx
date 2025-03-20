import { useMutation } from "@apollo/client";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import { logout } from "../redux/slices/authSlice";
import { clearAuthTokens } from "../utils/storage";
import { LogoutMutation } from "../api/auth/authMutations";
import { resetState } from "../redux/store";

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const dispatch = useDispatch();

    const [logoutMutation] = useMutation(LogoutMutation);

  const handleLogout = async () => {
    try {
      await logoutMutation();
    } catch (error: any) {
      console.warn("Logout failed on server, forcing local logout: ", error.message);
    } finally {
      await clearAuthTokens(); 
      dispatch(logout());
      dispatch(resetState());

      router.replace("/features/auth/login");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Dashboard" onPress={() => router.push("/features/dashboard")} />
      <Text style={styles.title}>{title}</Text>
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
