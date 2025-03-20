import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import { GetActiveCartQuery } from "@/app/api/cart/cartQueries";
import { UpdatePurchaseItemMutation, RemovePurchaseItemMutation } from "@/app/api/cart/cartMutations";
import { RootState } from "@/app/redux/store";
import { setCart, updateItem, removeItem } from "@/app/redux/slices/cartSlice";
import { CreateOrderMutation } from "@/app/api/order/orderMutations";
import { ExecutePaymentMutation } from "@/app/api/payment/paymentMutations";

export default function CartScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartId = useSelector((state: RootState) => state?.cart.cartId);
  const cartItems = useSelector((state: RootState) => state?.cart.items);
  const cartTotalPrice = useSelector((state: RootState) => state?.cart.totalPrice);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const { loading, error, data } = useQuery(GetActiveCartQuery);

  const [updatePurchaseItem] = useMutation(UpdatePurchaseItemMutation);
  const [removePurchaseItem] = useMutation(RemovePurchaseItemMutation);
  const [createOrder] = useMutation(CreateOrderMutation);
  const [executePayment] = useMutation(ExecutePaymentMutation);

  useEffect(() => {
    if (data?.getActiveCart) {
      const cart = data.getActiveCart;
      dispatch(setCart({
        cartId: cart.id,
        eventId: cart.event.id,
        items: cart.items.map((item: any) => ({
          ...item,
          id: Number(item.id),
          itemId: Number(item.itemId),
          totalPrice: Number(item.totalPrice),
        })),
        totalPrice: cart.totalPrice,
      }));
    }
  }, [data, dispatch]);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;
  if (cartItems && !cartItems.length) return <Text style={styles.emptyText}>Your cart is empty.</Text>;

  const handleUpdateQuantity = async (purchaseItemId: number, newQuantity: number) => {
    try {
      const { data } = await updatePurchaseItem({
        variables: { purchaseItemId, quantity: newQuantity  },
      });

      const updatedItem = data.updatePurchaseItem;
      dispatch(updateItem({ purchaseItemId: updatedItem.id, quantity: updatedItem.quantity, totalPrice: updatedItem.totalPrice }));
    } catch (error) {
      console.error("Update Quantity Error:", error);
    }
  };

  const handleRemoveItem = async (purchaseItemId: number) => {
    try {
      await removePurchaseItem({ variables: { purchaseItemId } });
      dispatch(removeItem({ purchaseItemId: purchaseItemId.toString() }));
    } catch (error) {
      console.error("Remove Item Error:", error);
    }
  };

  const handleMakeOrder = async () => {
    if (!cartId) {
      Alert.alert("Error", "Cart ID is missing!");
      return;
    }

    try {
      setLoadingOrder(true);

      const { data: orderData } = await createOrder({ variables: { cartId: Number(cartId) } });
      const orderId = orderData.createOrder.id;

      const { data: paymentData } = await executePayment({
        variables: { referenceId: Number(orderId) },
      });
      if (paymentData.executePayment.transactionStatus !== "Completed") {
        Alert.alert("Payment Failed", "Transaction was not successful.");
        return;
      }

      router.push(`/features/orders/${orderId}`);
    } catch (error) {
      console.error("Order Creation Error:", error);
      Alert.alert("Error", "Failed to create order or execute payment.");
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.itemType}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Price: ${item.totalPrice}</Text>

            <View style={styles.actions}>
              <Button title="-" onPress={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} />
              <Button title="+" onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)} />
              <Button title="Remove" onPress={() => handleRemoveItem(item.id)} color="red" />
            </View>
          </View>
        )}
      />

      <Text style={styles.totalPrice}>Total: ${cartTotalPrice}</Text>
      <Button title={loadingOrder ? "Processing..." : "Make Order"} onPress={handleMakeOrder} disabled={loadingOrder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  cartItem: { padding: 15, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  itemName: { fontSize: 18, fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  totalPrice: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 15 },
  errorText: { color: "red", fontSize: 16 },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "gray", textAlign: "center", marginTop: 50 },
});
