import { gql } from '@apollo/client';

export const GetEventsQuery = gql`
  query GetEvents {
    getEvents {
      id
      template {
        name
        description
      }
      date
      status
      availableTicketsQuantity
    }
  }
`;

export const GetEventDetailsQuery = gql`
  query GetEvent($eventId: Int!) {
    getEvent(eventId: $eventId) {
      id
      template {
        name
        description
      }
      date
      status
      availableTicketsQuantity
      tickets {
        id
        type
        availableQuantity
        price
      }
    }
  }
`;
