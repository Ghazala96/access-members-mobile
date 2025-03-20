import { gql } from '@apollo/client';

export const RegisterMutation = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        firstName
        lastName
        email
        role {
          id
          name
        }
        roleTags {
          id
          name
        }
      }
    }
  }
`;

export const LoginMutation = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
      }
    }
  }
`;

export const LogoutMutation = gql`
  mutation Logout {
    logout
  }
`;

export const RefreshTokenMutation = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
    }
  }
`;
