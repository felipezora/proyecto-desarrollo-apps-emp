import { NetworkStatus } from '@apollo/client';
import { Resolver } from 'types';

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
      const { db, session } = context;

      if (!session) {
        return null;
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
      if (userRole && userRole === "ADMINISTRATOR") {
        const newUser = await db.user.update({
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
        return newUser;
      }

      return null;
    }
  },
};

export { resolvers };
