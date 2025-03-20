import { gql } from '@apollo/client';

export const getProfileQuery = gql`
  query GetProfile {
    getProfile {
      id
      firstName
      lastName
      email
      role {
        name
      }
      roleTags {
        name
      }
    }
  }
`;
