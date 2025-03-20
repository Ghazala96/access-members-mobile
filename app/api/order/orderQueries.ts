import { gql } from '@apollo/client';

export const GetOrderQuery = gql`
  query GetOrder($orderId: Int!) {
    getOrder(orderId: $orderId) {
      id
      event {
        id
        template {
          name
          description
        }
        date
      }
      items {
        id
        unitPrice
        quantity
        totalPrice
        itemId
        itemType
      }
      totalPrice
      status
    }
  }
`;
