Feature: API GraphQL usando Cucumber

  Scenario: Crear un nuevo lider
    Given que el usuario con email "testadmin@test.com" es un "ADMINISTRATOR"
    When el usuario le asigna al usuario con id "clhbh2rcp000kunjgrzf6siqn" el rol "LEADER" y se obtiene el id del usuario
    Then el usuario es agregado exitosamente y al buscarlo por el email "testleader@test.com" se encuentra el usuario con id y rol "LEADER"

  Scenario: Crear un nuevo empleado
    Given que el usuario con email "testadmin@test.com" es un "ADMINISTRATOR"
    When el usuario le asigna al usuario con id "clhbgzsow0008unjgza0q9v2i" el rol "EMPLOYEE" y se obtiene el id del usuario
    Then el usuario es agregado exitosamente y al buscarlo por el email "testemploye@test.com" se encuentra el usuario con id y rol "EMPLOYEE"

  Scenario: Crear un nuevo proyecto
    Given que el usuario con email "testadmin@test.com" es un "ADMINISTRATOR"
    When el usuario crea un nuevo proyecto con nombre "Proyecto Test" y fecha de inicio "2023-04-01" y fecha planeada de fin "2023-05-01" y id de departamento "clhbah3vh0000d256hysn16a7" y se obtiene el id del proyecto
    Then el proyecto es agregado exitosamente y al buscarlo por el id se encuentra el proyecto con nombre "Proyecto Test" y fecha de inicio "2023-04-01T00:00:00.000Z" y fecha planeada de fin "2023-05-01T00:00:00.000Z"

  Scenario: Agregar un lider a un proyecto
    Given que el usuario con email "testadmin@test.com" es un "ADMINISTRATOR"
    When el usuario agrega un lider con id "clhbh2rcp000kunjgrzf6siqn" al proyecto con id
    Then el lider es agregado exitosamente al proyecto y al buscarlo por el id se encuentra el proyecto con el lider con email "testleader@test.com"

  Scenario: Agregar un empleado a un proyecto
    Given que el usuario con email "testadmin@test.com" es un "ADMINISTRATOR"
    When el usuario agrega un empleado con id "clhbgzsow0008unjgza0q9v2i" al proyecto con id
    Then el empleado es agregado exitosamente al proyecto y al buscarlo por el id se encuentra el proyecto con el empleado con email "testemploye@test.com"

  Scenario: Eliminar un proyecto
    Given que el usuario con email "testadmin@test.com" es un "ADMINISTRATOR"
    When el usuario elimina el proyecto con id
    Then el proyecto es eliminado exitosamente y al buscarlo por el id no se encuentra el proyecto