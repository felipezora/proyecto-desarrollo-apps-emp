import { gql } from "@apollo/client";

const GET_PROJECTS = gql`
  query Project($idProject: String!) {
    project(idProject: $idProject) {
      name
      end_date
      start_date
    }
  }
`;

const GET_PROJECT_LEADER = gql`
  query Project($idProject: String!) {
    project(idProject: $idProject) {
      leader {
        email
      }
    }
  }
`;

const GET_PROJECT_EMPLOYEES = gql`
  query Project($idProject: String!) {
    project(idProject: $idProject) {
      employees {
        email
      }
    }
  }
`;

const SET_PROJECT_LEADER = gql`
  mutation SetProjectLeader($idLeader: String!, $idProject: String!) {
    setProjectLeader(idLeader: $idLeader, idProject: $idProject) {
      id
    }
  }
`;

const ADD_PROJECT_EMPLOYEE = gql`
  mutation AddProjectEmployee($idEmployee: String!, $idProject: String!) {
    addProjectEmployee(idEmployee: $idEmployee, idProject: $idProject) {
      id
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation DeleteProject($idProject: String!) {
    deleteProject(idProject: $idProject) {
      id
    }
  }
`;

export { GET_PROJECTS, GET_PROJECT_LEADER, GET_PROJECT_EMPLOYEES, SET_PROJECT_LEADER, ADD_PROJECT_EMPLOYEE, DELETE_PROJECT };