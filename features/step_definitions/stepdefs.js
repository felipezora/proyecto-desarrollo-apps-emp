const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const { request } = require('graphql-request');

const endpoint = 'http://localhost:3000/api/graphql';
let response;
let responseProjectId;
let responseUserId;

//Scenario: Crear usuarios
Given(
  'que el usuario con email {string} es un {string}',
  async (email, role) => {
    const query = `query User($email: String!) {
    user(email: $email) {
      role {
        name
      }
   }
  }`;

    const variables = {
      email: email,
    };

    response = await request(endpoint, query, variables);

    const { user } = response;

    assert.strictEqual(user.role.name, role);
  }
);

When(
  'el usuario le asigna al usuario con id {string} el rol {string} y se obtiene el id del usuario',
  async (idUser, role) => {
    const mutation = `
      mutation ChangeUserRole($idUser: String!, $role: String!) {
        changeUserRole(idUser: $idUser, role: $role) {
          id
        } 
    }`;

    const variablesMutation = {
      idUser,
      role,
    };

    response = await request(endpoint, mutation, variablesMutation);
    const { changeUserRole } = response;
    responseUserId = changeUserRole.id;
  }
);

Then(
  'el usuario es agregado exitosamente y al buscarlo por el email {string} se encuentra el usuario con id y rol {string}',
  async (email, name, role) => {
    const query = `
    query User($email: String!) {
      user(email: $email) {
        id
        role {
          name
        }
      }
    }`;

    const variables = {
      email: email,
    };

    response = await request(endpoint, query, variables);

    const { user } = response;

    assert.strictEqual(user.id, responseUserId);
    assert.strictEqual(user.name, name);
    assert.strictEqual(user.role.name, role);
  }
);

//Scenario: Crear proyecto

When(
  'el usuario crea un nuevo proyecto con nombre {string} y fecha de inicio {string} y fecha planeada de fin {string} y se obtiene el id del proyecto',
  async (name, start_date, end_date) => {
    const mutation = `
      mutation CreateProject($data: ProjectCreateInput!) {
        createProject(data: $data) {
          id
        }
      }`;

    const variables = {
      data: {
        name,
        start_date,
        end_date,
      },
    };

    response = await request(endpoint, mutation, variables);

    const { createProject } = response;

    responseProjectId = createProject.id;
  }
);

Then(
  'el proyecto es agregado exitosamente y al buscarlo por el id se encuentra el proyecto con nombre {string} y fecha de inicio {string} y fecha planeada de fin {string}',
  async (name, start_date, end_date) => {
    const query = `
      query GetProject($where: FilterId!) {
        getProject(where: $where) {
          name
          start_date
          end_date
        }
      }`;

    const variables = {
      where: {
        id: responseProjectId,
      },
    };

    response = await request(endpoint, query, variables);

    const { getProject } = response;

    assert.strictEqual(getProject.name, name);
    assert.strictEqual(getProject.start_date, start_date);
    assert.strictEqual(getProject.end_date, end_date);
  }
);

//Scenario: Agregar un lider al proyecto

When(
  'el usuario agrega un lider con email {string} al proyecto con id',
  async (email) => {
    const mutation = `
      mutation SetProjectLeader($where: FilterId!, $userEmail: String!) {
         setProjectLeader(where: $where, userEmail: $userEmail) {
          id
        }
      }`;

    const variables = {
      where: {
        id: responseProjectId,
      },
      userEmail: email,
    };

    await request(endpoint, mutation, variables);
  }
);

Then(
  'el lider es agregado exitosamente al proyecto y al buscarlo por el id se encuentra el proyecto con el lider con email {string}',
  async (email) => {
    const query = `
      query GetProject($where: FilterId!) {
        getProject(where: $where) {
          leader {
            email
          }
        }
      }`;

    const variables = {
      where: {
        id: responseProjectId,
      },
    };

    response = await request(endpoint, query, variables);

    const { getProject } = response;

    assert.strictEqual(getProject.leader.email, email);
  }
);

//Scenario: Agregar un miembro al proyecto
When(
  'el usuario agrega un empleado con email {string} al proyecto con id',
  async (email) => {
    const mutation = `
      mutation AddProjectEmployee($where: FilterId!, $employeeEmail: String!) {
        addProjectEmployee(where: $where, employeeEmail: $employeeEmail) {
          id
        }
      }`;

    const variables = {
      where: {
        id: responseProjectId,
      },
      employeeEmail: email,
    };

    await request(endpoint, mutation, variables);
  }
);

Then(
  'el empleado es agregado exitosamente al proyecto y al buscarlo por el id se encuentra el proyecto con el empleado con email {string}',
  async (email) => {
    const query = `
      query GetProject($where: FilterId!) {
        getProject(where: $where) {
          employees {
            email
          }
        }
      }`;

    const variables = {
      where: {
        id: responseProjectId,
      },
    };

    response = await request(endpoint, query, variables);

    const { getProject } = response;

    const employeeEmail = getProject.employees[0].email;

    assert.strictEqual(employeeEmail, email);
  }
);

//Scenario: Elimitar proyecto

When('el usuario elimina el proyecto con id {string}', async (id) => {
  const mutation = `
      mutation DeleteProject($where: FilterId!) {
        deleteProject(where: $where){
          id
        }
      }`;

  const variables = {
    where: {
      id: responseProjectId,
    },
  };

  await request(endpoint, mutation, variables);
});

Then(
  'el proyecto es eliminado exitosamente y al buscarlo por el id no se encuentra el proyecto',
  async () => {
    const query = `
      query GetProject($where: FilterId!) {
        getProject(where: $where) {
          id
        }
      }`;

    const variables = {
      where: {
        id: responseProjectId,
      },
    };

    response = await request(endpoint, query, variables);

    const { getProject } = response;

    assert.strictEqual(getProject, null);
  }
);
