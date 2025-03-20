import { useQuery } from "@apollo/client";
import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { GetEventDetailsQuery } from "@/app/api/event/eventQueries";
import { formatDate } from "@/app/utils/dates";

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { loading, error, data } = useQuery(GetEventDetailsQuery, {
    variables: { eventId: Number(id) },
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading event details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load event details. Please try again.</Text>
      </View>
    );
  }

  if (!data?.getEvent) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noEventText}>This event does not exist or has been removed.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.getEvent.template.name}</Text>
      <Text>Date: {formatDate(data.getEvent.date)}</Text>
      <Text>{data.getEvent.template.description}</Text>

      <Text style={styles.subtitle}>Available Tickets:</Text>
      {data.getEvent.tickets.length ? (
        <Text style={styles.noTicketsText}>No tickets available for this event.</Text>
      ) : (
        <FlatList
          data={data.getEvent.tickets}
          keyExtractor={(ticket) => ticket.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.ticketCard}>
              <Text>Type: {item.type}</Text>
              <Text>Available: {item.availableQuantity}</Text>
              <Text>Price: ${item.price}</Text>
            </View>
          )}
        />
      )}

      <Button title="Purchase Tickets" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 15 },
  ticketCard: { padding: 15, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },
  noEventText: { fontSize: 18, fontWeight: "bold", color: "gray" },
  noTicketsText: { fontSize: 16, fontStyle: "italic", color: "gray" },
});