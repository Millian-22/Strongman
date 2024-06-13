import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const workoutLogRouter = createTRPCRouter({
    getLatest: protectedProcedure.query(({ ctx }) => {
        return ctx.db.workoutLog.findFirst({
          orderBy: { createdAt: "desc" },
          where: { userId: "1" },
        });
    }),
    getAll: protectedProcedure.query(({ctx}) => {
      return ctx.db.workoutLog.findMany();
    }),
    createWorkoutLog: protectedProcedure.input(z.object({ date: z.string().datetime()})).mutation(async ({ctx, input}) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!ctx.session || !ctx.session.user) {
        throw new Error('Unauthorized');
      }

      const userId = ctx.session?.user.id;
      console.log('input.date', input.date);

      return ctx.db.workoutLog.create({
        data: {
          userId,
        },
      });
    }),
});
