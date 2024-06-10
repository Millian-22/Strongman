import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const liftingLogRouter = createTRPCRouter({
    getLatest: protectedProcedure.query(({ ctx }) => {
        return ctx.db.workoutLog.findFirst({
          orderBy: { createdAt: "desc" },
          where: { userId: "1" },
        });
    }),
    getAll: protectedProcedure.query(({ctx}) => {
      return ctx.db.workoutLog.findMany();
    }),

    submitLift:  protectedProcedure.input(z.object({ workoutDate: z.string().datetime(), exercise: z.string(), reps: z.number().int()  }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.workoutLog.create({
        data: {
          createdAt: new Date(),
          workoutDate: input.workoutDate,
          exercise: input.exercise,
          reps: input.reps,
          userId: "1",
        },
      });
    }),
});
