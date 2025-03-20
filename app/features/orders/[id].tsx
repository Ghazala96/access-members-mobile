import React from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";
import { GetOrderQuery } from "@/app/api/order/orderQueries";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id: orderId } = useLocalSearchParams();

  const { loading, error, data } = useQuery(GetOrderQuery, {
    variables: { orderId: Number(orderId) },
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading order: {error.message}</Text>
      </View>
    );
  }

  if (!data?.getOrder) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Order not found.</Text>
      </View>
    );
  }

  const order = data.getOrder;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order #{order.id}</Text>
      <Text style={styles.status}>Status: {order.status}</Text>
      <Text style={styles.eventTitle}>{order.event.template.name}</Text>
      <Text>{order.event.template.description}</Text>

      <FlatList
        data={order.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemType}>{item.itemType}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Total Price: ${item.totalPrice}</Text>
          </View>
        )}
      />

      <Text style={styles.totalPrice}>Total: ${order.totalPrice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  status: { fontSize: 18, fontWeight: "bold", color: "blue", textAlign: "center", marginBottom: 10 },
  eventTitle: { fontSize: 20, fontWeight: "bold", marginTop: 15 },
  itemCard: { padding: 15, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  itemType: { fontSize: 16, fontWeight: "bold" },
  totalPrice: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 15 },
  errorText: { color: "red", fontSize: 16, textAlign: "center" },
});
