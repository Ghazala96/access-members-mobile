import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";

import { getToken } from "./utils/storage";

export default function IndexScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken("accessToken");
      if (token) {
        router.replace("/features/dashboard");
      } else {
        router.replace("/features/auth/login");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  return null;
}
