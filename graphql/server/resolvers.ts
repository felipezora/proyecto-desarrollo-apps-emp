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
  Query: {
    user: async (parent, args, context) => {
      return await context.db.user.findUnique({
        where: {
          email: args.email,
        },
      });
    }
  },
  Mutation: {}
};

export { resolvers };
