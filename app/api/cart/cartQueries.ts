import { gql } from '@apollo/client';

export const GetActiveCartQuery = gql`
  query GetActiveCart {
    getActiveCart {
      id
      event {
        id
      }
      items {
        id
        itemId
        itemType
        unitPrice
        quantity
        totalPrice
      }
      totalPrice
    }
  }
`;
