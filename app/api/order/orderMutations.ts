import { gql } from '@apollo/client';

export const CreateOrderMutation = gql`
  mutation CreateOrder($cartId: Int!) {
    createOrder(cartId: $cartId) {
      id
      event {
        id
        template {
          name
        }
      }
      items {
        id
        unitPrice
        totalPrice
        itemId
        itemType
      }
      totalPrice
      status
    }
  }
`;
