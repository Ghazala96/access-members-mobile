import { useQuery } from "@apollo/client";
import { View, Text, ActivityIndicator, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { getProfileQuery } from "@/app/api/user/userQueries";

export default function DashboardScreen() {
  const router = useRouter();
  const { loading, error, data } = useQuery(getProfileQuery);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load profile. Please try again.</Text>
      </View>
    );
  }

  const user = data?.getProfile;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.firstName} {user.lastName}!</Text>
      <Button title="View Events" onPress={() => router.push("/features/events")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },
});
