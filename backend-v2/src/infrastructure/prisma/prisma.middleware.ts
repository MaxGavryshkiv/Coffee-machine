import { Prisma } from '@prisma/client';

/**
 * Prisma Extension для multi-tenant ізоляції.
 * Автоматично:
 *  - додає tenantId при create
 *  - фільтрує по tenantId при find/update/delete
 */
export function tenantExtension(tenantId: string) {
  return Prisma.defineExtension({
    name: 'tenant-extension',

    query: {
      $allModels: {
        async findMany({ args, query }) {
          args.where = {
            ...args?.where,
            tenantId,
          };
          return query(args);
        },

        async findFirst({ args, query }) {
          args.where = {
            ...args?.where,
            tenantId,
          };
          return query(args);
        },

        async findUnique({ args, query }) {
          args.where = {
            ...args?.where,
            tenantId,
          };
          return query(args);
        },

        async create({ args, query }) {
          args.data = {
            ...(args.data as any),
            tenantId,
          };
          return query(args);
        },

        async update({ args, query }) {
          args.where = {
            ...args.where,
            tenantId,
          };
          return query(args);
        },

        async delete({ args, query }) {
          args.where = {
            ...args.where,
            tenantId,
          };
          return query(args);
        },

        async updateMany({ args, query }) {
          args.where = {
            ...args?.where,
            tenantId,
          };
          return query(args);
        },

        async deleteMany({ args, query }) {
          args.where = {
            ...args?.where,
            tenantId,
          };
          return query(args);
        },
      },
    },
  });
}
