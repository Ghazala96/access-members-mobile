import { useRouter } from "expo-router";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useState } from "react";

import { loginSuccess } from "../../redux/slices/authSlice";
import { saveToken } from "../../utils/storage";
import { LoginMutation } from "../../api/authMutations";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [login] = useMutation(LoginMutation);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await login({
        variables: { input: { email, password } },
      });
      const { accessToken, refreshToken, user } = data.login;
      await saveToken("accessToken", accessToken);
      await saveToken("refreshToken", refreshToken);
      dispatch(loginSuccess({ accessToken, refreshToken, user }));

      router.replace("/features/dashboard");
    } catch (error: any) {
      console.error("GraphQL Login Error:", error);
      let errorMessage = "An unknown error occurred";

      if (error.graphQLErrors?.length) {
        errorMessage = error.graphQLErrors.map((err: any) => err.message).join("\n");
      } else if (error.networkError) {
        errorMessage = "Network error: Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} />
          <Button title="Go to Register" onPress={() => router.push("/features/auth/register")} color="gray" />
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
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
