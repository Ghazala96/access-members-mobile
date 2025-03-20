import { useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";
import { useState } from "react";

import { logout } from "../../redux/slices/authSlice";
import { clearAuthTokens } from "../../utils/storage";
import { LogoutMutation } from "../../api/authMutations";

export default function DashboardScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [logoutMutation] = useMutation(LogoutMutation);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutMutation();
    } catch (error: any) {
      console.warn("Logout failed on server, forcing local logout:", error.message);
    } finally {
      await clearAuthTokens(); 
      dispatch(logout());

      router.replace("/features/auth/login");
      setLoading(false);
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Dashboard!</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
