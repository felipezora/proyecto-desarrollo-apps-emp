const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const { request } = require('graphql-request');

const endpoint = 'http://localhost:3000/api/graphql';
let response;
let responseProjectId;
let responseUserId;

//Scenario: Crear usuarios
Given(
  'que el usuario con email {string} es un administrador',
  async (email) => {
    const query = `
    query GetUser($email: String!) {
      getUser(email: $email) {
        role {
          name
        }
      }
    }`;

    const variables = {
      email: email,
    };

    response = await request(endpoint, query, variables);

    const { getUser } = response;

    assert.strictEqual(getUser.role.name, 'administrator');
  }
);

When(
  'el usuario crea un nuevo usuario con email {string} y nombre {string} y id de rol {string} y se obtiene el id del usuario',
  async (email, name, roleId) => {
    const mutation = `
      mutation CreateUser($data: UserCreateInput!) {
        createUser(data: $data) {
          id
        }
      }`;

    const query = `
    query GetUser($email: String!) {
      getUser(email: $email) {
        id
      }
    }`;

    const variablesQuery = {
      email: email,
    };

    const variablesMutation = {
      data: {
        name,
        email,
        roleId,
      },
    };

    try {
      response = await request(endpoint, mutation, variablesMutation);
      const { createUser } = response;
      responseUserId = createUser.id;
    } catch (error) {
      response = await request(endpoint, query, variablesQuery);
      const { getUser } = response;
      responseUserId = getUser.id;
    }
  }
);

Then(
  'el usuario es agregado exitosamente y al buscarlo por el email {string} se encuentra el usuario con id y nombre {string} y rol {string}',
  async (email, name, role) => {
    const query = `
    query GetUser($email: String!) {
      getUser(email: $email) {
        id
        name
        role {
          name
        }
      }
    }`;

    const variables = {
      email: email,
    };

    response = await request(endpoint, query, variables);

    const { getUser } = response;

    assert.strictEqual(getUser.id, responseUserId);
    assert.strictEqual(getUser.name, name);
    assert.strictEqual(getUser.role.name, role);
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
