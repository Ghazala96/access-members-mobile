import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Modal from "react-native-modal";

interface QuantityModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

export default function QuantityModal({ isVisible, onClose, onConfirm }: QuantityModalProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Select Quantity</Text>

        <View style={styles.quantityControls}>
          <Button title="-" onPress={() => setQuantity((prev) => Math.max(1, prev - 1))} />
          <Text style={styles.quantityText}>{quantity}</Text>
          <Button title="+" onPress={() => setQuantity((prev) => prev + 1)} />
        </View>

        <Button title="Confirm" onPress={() => onConfirm(quantity)} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 15,
  },
});
