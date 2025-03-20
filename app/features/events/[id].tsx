import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  StyleSheet
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { GetEventDetailsQuery } from "@/app/api/event/eventQueries";
import { InitiateCartMutation, AddPurchaseItemMutation } from "@/app/api/cart/cartMutations";
import { RootState } from "@/app/redux/store";
import { setCart, addItem } from "@/app/redux/slices/cartSlice";
import { formatDate } from "@/app/utils/dates";
import ModalComponent from "@/app/components/QuantityModal";
import { Ticket } from "@/app/types";

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id: eventId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const cartId = useSelector((state: RootState) => state?.cart.cartId);
  const cartItems = useSelector((state: RootState) => state?.cart.items);
  const cartTotalPrice = useSelector((state: RootState) => state?.cart.totalPrice);
  const { loading, error, data: eventData } = useQuery(GetEventDetailsQuery, {
    variables: { eventId: Number(eventId) },
  });

  const [initiateCart] = useMutation(InitiateCartMutation);
  const [addPurchaseItem] = useMutation(AddPurchaseItemMutation);
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;
  if (!eventData?.getEvent) return <Text style={styles.noEventText}>Event not found.</Text>;

  const event = eventData.getEvent;

  const handleAddToCartPress = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const handleConfirmQuantity = async (quantity: number) => {
    setModalVisible(false);
    if (!selectedTicket) return;

    try {
      let cartIdToUse = cartId;
      if (!cartIdToUse) {
        const { data: cartData } = await initiateCart({ variables: { eventId: Number(eventId) } });
        const cart = cartData.initiateCart;
        dispatch(setCart({ cartId: cart.id, eventId: eventId as string, items: [], totalPrice: 0 }));
        cartIdToUse = Number(cart.id);
      }

      const { data: itemData } = await addPurchaseItem({
        variables: { cartId: cartIdToUse, itemId: Number(selectedTicket.id), quantity },
      });

      const item = itemData.addPurchaseItem;
      dispatch(addItem({
        id: item.id,
        itemId: item.itemId,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      }));
    } catch (error) {
      console.error("Add to Cart Error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.template.name}</Text>
      <Text>Date: {formatDate(event.date)}</Text>
      <Text>{event.template.description}</Text>

      <FlatList
        data={event.tickets}
        keyExtractor={(ticket) => ticket.id}
        renderItem={({ item }) => (
          <View style={styles.ticketCard}>
            <Text>Type: {item.type}</Text>
            <Text>Available: {item.availableQuantity}</Text> 
            <Text>Price: ${item.price}</Text>
            <Button title="Add to Cart" onPress={() => handleAddToCartPress(item)} />
          </View>
        )}
      />

      {cartItems && cartItems.length > 0 && (
        <View style={styles.viewCartContainer}>
          <Button
            title={`View Cart ($${cartTotalPrice})`}
            onPress={() => router.push('/features/cart')}
          />
        </View>
      )}

      <ModalComponent 
        isVisible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        onConfirm={handleConfirmQuantity} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  ticketCard: { padding: 15, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  viewCartContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 10,
  },
  errorText: { color: "red", fontSize: 16 },
  noEventText: { fontSize: 18, fontWeight: "bold", color: "gray" },
});
