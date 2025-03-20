import { useQuery } from "@apollo/client";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { GetEventsQuery } from "@/app/api/event/eventQueries";
import { formatDate } from "@/app/utils/dates";

export default function EventsScreen() {
  const router = useRouter();
  const { loading, error, data } = useQuery(GetEventsQuery);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load events. Please try again.</Text>
      </View>
    );
  }

  if (!data?.getEvents?.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noEventsText}>No events available at the moment.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Events</Text>
      <FlatList
        data={data.getEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => router.push(`/features/events/${item.id}`)}
          >
            <Text style={styles.eventName}>{item.template.name}</Text>
            <Text>Date: {formatDate(item.date)}</Text>
            <Text>Tickets Available: {item.availableTicketsQuantity}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  eventCard: { padding: 15, marginBottom: 10, borderWidth: 1, borderRadius: 8 },
  eventName: { fontSize: 18, fontWeight: "bold" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },
  noEventsText: { fontSize: 18, fontWeight: "bold", color: "gray" },
});