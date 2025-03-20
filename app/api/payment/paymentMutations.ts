import { gql } from '@apollo/client';

export const ExecutePaymentMutation = gql`
  mutation ExecutePayment($referenceId: Int!) {
    executePayment(input: { referenceType: "Order", referenceId: $referenceId }) {
      transactionId
      transactionStatus
    }
  }
`;
