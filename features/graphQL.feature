Feature: API GraphQL usando Cucumber

  Scenario: Crear un nuevo lider
    Given que el usuario con email "testfinal@test.com" es un "ADMINISTRATOR"
    When el usuario le asigna al usuario con id "clhb55mu90000un98wt65zt35" el rol "LEADER" y se obtiene el id del usuario
    Then el usuario es agregado exitosamente y al buscarlo por el email "testLeader@test.com" se encuentra el usuario con id y rol "LEADER"

  Scenario: Crear un nuevo empleado
    Given que el usuario con email "testAdmin@test.com" es un administrador
    When el usuario crea un nuevo usuario con id "clhb55mu90000un98wt65zt35" y nombre "testEmployee" y id de rol "clh20dmqx002378una856sdkt" y se obtiene el id del usuario
    Then el usuario es agregado exitosamente y al buscarlo por el email "testEmployee@test.com" se encuentra el usuario con id y nombre "testEmployee" y rol "employee"

  Scenario: Crear un nuevo proyecto
    Given que el usuario con email "testAdmin@test.com" es un administrador
    When el usuario crea un nuevo proyecto con nombre "Proyecto Test" y fecha de inicio "2023-04-01" y fecha planeada de fin "2023-05-01" y se obtiene el id del proyecto
    Then el proyecto es agregado exitosamente y al buscarlo por el id se encuentra el proyecto con nombre "Proyecto Test" y fecha de inicio "2023-04-01T00:00:00.000Z" y fecha planeada de fin "2023-05-01T00:00:00.000Z"

  Scenario: Agregar un lider a un proyecto
    Given que el usuario con email "testAdmin@test.com" es un administrador
    When el usuario agrega un lider con email "testLeader@test.com" al proyecto con id
    Then el lider es agregado exitosamente al proyecto y al buscarlo por el id se encuentra el proyecto con el lider con email "testLeader@test.com"

  Scenario: Agregar un empleado a un proyecto
    Given que el usuario con email "testAdmin@test.com" es un administrador
    When el usuario agrega un empleado con email "testEmployee@test.com" al proyecto con id
    Then el empleado es agregado exitosamente al proyecto y al buscarlo por el id se encuentra el proyecto con el empleado con email "testEmployee@test.com"

  Scenario: Eliminar un proyecto
    Given que el usuario con email "testAdmin@test.com" es un administrador
    When el usuario elimina el proyecto con id "id"
    Then el proyecto es eliminado exitosamente y al buscarlo por el id no se encuentra el proyecto