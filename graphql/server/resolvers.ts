import { NetworkStatus } from '@apollo/client';
import { Resolver } from 'types';

const roleValidator = async ({ db, session }, requiredRole) => {
  if (!session) {
    return false;
  }

  const email = session.user?.email ?? '';

  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    include: {
      role: true,
    },
  });

  const userRole = user?.role?.name;
  if (userRole && userRole === requiredRole) {
    return true;
  }
  return false;
}

const resolvers: Resolver = {
  User: {
    department: async (parent, args, context) => {
      if (!parent.departmentId) {
        return null;
      }
      return await context.db.department.findUnique({
        where: {
          id: parent.departmentId,
        },
      });
    },
    role: async (parent, args, context) => {
      if (!parent.roleId) {
        return null;
      }
      return await context.db.role.findUnique({
        where: {
          id: parent.roleId,
        },
      });
    },
    departmentLeader: async (parent, args, context) => {
      return await context.db.department.findMany({
        where: {
          departmentLeaderId: parent.id,
        },
      });
    },
    projectLeader: async (parent, args, context) => {
      return await context.db.project.findMany({
        where: {
          id_leader: parent.id,
        },
      });
    },
    projectMember: async (parent, args, context) => {
      return await context.db.project.findMany({
        where: {
          employees: {
            some: {
              id: parent.id,
            },
          },
        },
      });
    },
  },
  Project: {
    leader: async (parent, args, context) => {
      if (!parent.id_leader) {
        return null;
      }
      return await context.db.user.findUnique({
        where: {
          id: parent.id_leader
        },
      });
    },
    department: async (parent, args, context) => {
      if (!parent.departmentId) {
        return null;
      }
      return await context.db.department.findUnique({
        where: {
          id: parent.departmentId
        },
      });
    },
    employees: async (parent, args, context) => {
      return await context.db.user.findMany({
        where: {
          projectMember: {
            some: {
              id: parent.id,
            }
          }
        },
      });
    },
    files: async (parent, args, context) => {
      return await context.db.file.findMany({
        where: {
          projectId: parent.id
        },
      });
    },
  },
  Department: {
    leader: async (parent, args, context) => {
      return await context.db.user.findUnique({
        where: {
          id: parent.departmentLeaderId
        },
      });
    },
    employees: async (parent, args, context) => {
      return await context.db.user.findMany({
        where: {
          departmentId: parent.id
        },
      });
    },
    projects: async (parent, args, context) => {
      return await context.db.project.findMany({
        where: {
          departmentId: parent.id
        },
      });
    },
  },
  File: {
    project: async (parent, args, context) => {
      return await context.db.project.findMany({
        where: {
          files: {
            some: {
              id: parent.id
            },
          },
        },
      });
    },
  },
  Query: {
    user: async (parent, args, context) => {
      return await context.db.user.findUnique({
        where: {
          email: args.email,
        },
      });
    }
  },
  Mutation: {
    changeUserRole: async (parent, args, context) => {
      const validationResult = await roleValidator(context, "ADMINISTRATOR");
      if (validationResult) {

        const oldUser = await context.db.user.findUnique({
          where: {
            id: args.idUser
          }
        });

        const newUser = await context.db.user.update({
          where: {
            id: args.idUser,
          },
          data: {
            role: {
              connect: {
                name: args.role
              }
            }
          }
        });

        await context.db.log.create({
          data: {
            description: `El usuario con email: ${context.session.user.email} ha hecho una modificación. Registro antes: ${JSON.stringify(oldUser)} Registro después: ${JSON.stringify(newUser)}`,
          }
        });

        return newUser;
      }
      return null;
    },
    createProject: async (parent, args, context) => {
      const validationResult = await roleValidator(context, "ADMINISTRATOR");
      const { name, start_date, end_date, idDepartment } = args;
      if (validationResult) {

        const newProject = await context.db.project.create({
          data: {
            name: name,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            department: {
              connect: {
                id: idDepartment
              }
            }
          }
        });

        await context.db.log.create({
          data: {
            description: `El usuario con email: ${context.session.user.email} ha hecho una creación. Registro: ${JSON.stringify(newProject)}`,
          }
        });

        return newProject;
      }
      return null;
    },
    setProjectLeader: async (parent, args, context) => {
      const validationResult = await roleValidator(context, "ADMINISTRATOR");
      if (validationResult) {

        const oldProject = await context.db.project.findUnique({
          where: {
            id: args.idProject
          }
        });

        const newProject = await context.db.project.update({
          where: {
            id: args.idProject,
          },
          data: {
            leader: {
              connect: {
                id: args.idLeader
              },
            },
          },
        });

        await context.db.log.create({
          data: {
            description: `El usuario con email: ${context.session.user.email} ha hecho una modificación. Registro antes: ${JSON.stringify(oldProject)} Registro después: ${JSON.stringify(newProject)}`,
          }
        });

        return newProject;
      }
      return null;
    },
    addProjectEmployee: async (parent, args, context) => {
      const { idEmployee, idProject } = args;
      const validationResult = await roleValidator(context, "ADMINISTRATOR");
      if (validationResult) {

        const oldProject = await context.db.project.findUnique({
          where: {
            id: idProject
          }
        });

        const newProject = await context.db.project.update({
          where: {
            id: idProject
          },
          data: {
            employees: {
              connect: {
                id: idEmployee
              }
            }
          }
        })

        await context.db.log.create({
          data: {
            description: `El usuario con email: ${context.session.user.email} ha hecho una modificación. Registro antes: ${JSON.stringify(oldProject)} Registro después: ${JSON.stringify(newProject)}`,
          }
        });

        return newProject;
      }
      return null;
    },
    deleteProject: async (parent, args, context) => {
      const validationResult = await roleValidator(context, "ADMINISTRATOR");
      if (validationResult) {

        const oldProject = context.db.project.delete({
          where: {
            id: args.idProject
          }
        })

        await context.db.log.create({
          data: {
            description: `El usuario con email: ${context.session.user.email} ha hecho una eliminación. Registro: ${JSON.stringify(oldProject)}`,
          }
        });

      }
      return null;
    }
  },
};

export { resolvers };
