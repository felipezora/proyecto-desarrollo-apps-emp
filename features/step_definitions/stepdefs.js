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
      email,
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
  async (email, role) => {
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
      email,
    };

    response = await request(endpoint, query, variables);

    const { user } = response;

    assert.strictEqual(user.id, responseUserId);
    assert.strictEqual(user.role.name, role);
  }
);

//Scenario: Crear proyecto

When(
  'el usuario crea un nuevo proyecto con nombre {string} y fecha de inicio {string} y fecha planeada de fin {string} y id de departamento {string} y se obtiene el id del proyecto',
  async (name, startDate, endDate, idDepartment) => {
    const mutation = `
      mutation CreateProject($name: String!, $startDate: DateTime!, $endDate: DateTime!, $idDepartment: String!) {
        createProject(name: $name, start_date: $startDate, end_date: $endDate, idDepartment: $idDepartment) {
          id
        }
    }`;

    const variables = {
      name,
      startDate,
      endDate,
      idDepartment,
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
      query Project($idProject: String!) {
        project(idProject: $idProject) {
          name
          end_date
          start_date
      }
    }`;

    const variables = {
      idProject: responseProjectId,
    };

    response = await request(endpoint, query, variables);

    const { project } = response;

    assert.strictEqual(project.name, name);
    assert.strictEqual(project.start_date, start_date);
    assert.strictEqual(project.end_date, end_date);
  }
);

//Scenario: Agregar un lider al proyecto

When(
  'el usuario agrega un lider con id {string} al proyecto con id',
  async (idLeader) => {
    const mutation = `
      mutation SetProjectLeader($idLeader: String!, $idProject: String!) {
        setProjectLeader(idLeader: $idLeader, idProject: $idProject) {
          id
        }
    }`;

    const variables = {
      idProject: responseProjectId,
      idLeader,
    };

    await request(endpoint, mutation, variables);
  }
);

Then(
  'el lider es agregado exitosamente al proyecto y al buscarlo por el id se encuentra el proyecto con el lider con email {string}',
  async (email) => {
    const query = `
      query Project($idProject: String!) {
        project(idProject: $idProject) {
          leader {
            email
          }
        }
      }`;

    const variables = {
      idProject: responseProjectId,
    };

    response = await request(endpoint, query, variables);

    const { project } = response;

    assert.strictEqual(project.leader.email, email);
  }
);

//Scenario: Agregar un miembro al proyecto
When(
  'el usuario agrega un empleado con id {string} al proyecto con id',
  async (idEmployee) => {
    const mutation = `
      mutation AddProjectEmployee($idEmployee: String!, $idProject: String!) {
        addProjectEmployee(idEmployee: $idEmployee, idProject: $idProject) {
          id
        }
    }`;

    const variables = {
      idProject: responseProjectId,
      idEmployee,
    };

    await request(endpoint, mutation, variables);
  }
);

Then(
  'el empleado es agregado exitosamente al proyecto y al buscarlo por el id se encuentra el proyecto con el empleado con email {string}',
  async (email) => {
    const query = `
      query Project($idProject: String!) {
        project(idProject: $idProject) {
          employees {
            email
          }
        }
      }`;

    const variables = {
      idProject: responseProjectId,
    };

    response = await request(endpoint, query, variables);

    const { project } = response;

    const employeeEmail = project.employees[0].email;

    assert.strictEqual(employeeEmail, email);
  }
);

//Scenario: Elimitar proyecto

When('el usuario elimina el proyecto con id', async () => {
  const mutation = `
      mutation DeleteProject($idProject: String!) {
        deleteProject(idProject: $idProject) {
          id
        }
      }`;

  const variables = {
    idProject: responseProjectId,
  };

  await request(endpoint, mutation, variables);
});

Then(
  'el proyecto es eliminado exitosamente y al buscarlo por el id no se encuentra el proyecto',
  async () => {
    const query = `
      query Project($idProject: String!) {
        project(idProject: $idProject) {
          id
        }
      }`;

    const variables = {
      idProject: responseProjectId,
    };

    response = await request(endpoint, query, variables);

    const { project } = response;

    assert.strictEqual(project, null);
  }
);
