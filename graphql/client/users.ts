import { gql } from '@apollo/client';

const GET_USERS = gql`
  query Users {
    users {
      name
      email
    }
  }
`;

const GET_USER = gql`
  query User($email: String!) {
    user(email: $email) {
      email
      name
      role {
        name
      }
    }
  }
`;

const USER_ROLE = gql`
  query User($email: String!) {
    user(email: $email) {
      role {
        name
      }
   }
  }
`;

const UPDATE_USER_ROLE = gql`
  mutation ChangeUserRole($idUser: String!, $role: String!) {
    changeUserRole(idUser: $idUser, role: $role) {
      id
      role {
        name
      }
    }
  }
`;

export { GET_USERS, GET_USER, USER_ROLE, UPDATE_USER_ROLE };