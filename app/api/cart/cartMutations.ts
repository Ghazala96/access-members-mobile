import { gql } from '@apollo/client';

export const InitiateCartMutation = gql`
  mutation InitiateCart($eventId: Int!) {
    initiateCart(eventId: $eventId) {
      id
      event {
        id
        template {
          name
        }
      }
      createdBy {
        firstName
      }
      totalPrice
      status
      items {
        id
      }
    }
  }
`;

export const AddPurchaseItemMutation = gql`
  mutation AddPurchaseItem($cartId: Int!, $itemId: Int!, $quantity: Int!) {
    addPurchaseItem(
      cartId: $cartId
      item: { itemId: $itemId, itemType: "Ticket", quantity: $quantity }
    ) {
      id
      itemId
      itemType
      unitPrice
      quantity
      totalPrice
      cart {
        id
        totalPrice
      }
    }
  }
`;

export const UpdatePurchaseItemMutation = gql`
  mutation UpdatePurchaseItem($purchaseItemId: Int!, $quantity: Int!) {
    updatePurchaseItem(purchaseItemId: $purchaseItemId, input: { quantity: $quantity }) {
      id
      itemId
      itemType
      unitPrice
      quantity
      totalPrice
      cart {
        id
        totalPrice
      }
    }
  }
`;

export const RemovePurchaseItemMutation = gql`
  mutation RemovePurchaseItem($purchaseItemId: Int!) {
    removePurchaseItem(purchaseItemId: $purchaseItemId)
  }
`;
