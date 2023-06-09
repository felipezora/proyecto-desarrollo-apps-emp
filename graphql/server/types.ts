import { gql } from 'graphql-tag';

const typeDefs = gql`
  scalar DateTime

  type Role {
    id: ID
    name: String
    users: [User]
  }

  type User {
    id: ID
    email: String
    image: String
    name: String
    emailVerified: DateTime
    department: Department
    departmentId: String
    role: Role
    roleId: String
    departmentLeader: [Department]
    projectLeader: [Project]
    projectMember: [Project]
  }

  type Project{
    id: ID
    name: String
    start_date: DateTime
    end_date: DateTime
    leader: User
    id_leader: String
    department: Department
    departmentId: String
    employees: [User]
    files: [File]
  }

  type Log{
    id: ID
    description: String
    createdAt: DateTime
  }

  type Department {
    id: ID
    name: String
    departmentLeaderId: String
    leader: User
    employees: [User]
    projects: [Project]
  }

  type File {
    id: ID
    format: String
    name: String
    url: String
    project: Project
    projectId: String
  }

  type Query {
    user(email: String!): User
    users: [User]
    userEmployeeProjects(idUser: String!): [Project]
    userLeaderProjects(idUser: String!): [Project]
    project(idProject: String!): Project
    userLeaderDepartments(idUser: String!): [Department]
    projectFiles(idProject: String!): [File]
  }

  type Mutation {
    createProject(name: String!, start_date: DateTime!, end_date: DateTime!, idDepartment: String!): Project
    setProjectLeader(idLeader: String!, idProject: String!): Project
    addProjectEmployee(idEmployee: String!, idProject: String!): Project
    removeProjectEmployee(idEmployee: String!): Project
    deleteProject(idProject: String!): Project
    createDepartment(name: String!, idLeader: String!): Department
    addDepartmentEmployee(idDepartment: String!, idEmployee: String!): Department
    createFile(format: String!, name: String!, url: String!): File
    setProjectFile(idProject: String!): File
    removeProjectFile(idFile: String!): Project
    changeUserRole(idUser: String!, role: String!): User
  }
`;

export { typeDefs };
