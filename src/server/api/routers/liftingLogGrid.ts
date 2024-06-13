import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const liftingLogGridRouter = createTRPCRouter({
  getLatest: protectedProcedure.query(({ ctx }) => {
      return ctx.db.liftingLogGrid.findFirst({
        orderBy: { createdAt: "desc" },
        where: { userId: "1" },
      });
  }),
  getAll: protectedProcedure.query(({ctx}) => {
    return ctx.db.liftingLogGrid.findMany();
  }),

  createWorkout:  protectedProcedure.input(z.object({ date: z.string().datetime(), exercise: z.string(), reps: z.number().int(), weight: z.number(), id: z.string() }))
  .mutation(async ({ ctx, input }) => {

    if (!ctx.session || !ctx.session.user) {
      throw new Error('Unauthorized');
    }

    const userId = ctx.session?.user.id;

    console.log('userId', userId);
    console.log('date', input.date);

    return ctx.db.liftingLogGrid.create({
      data: {
        createdAt: new Date(),
        date: input.date,
        exercise: input.exercise,
        reps: input.reps,
        weight: input.weight,
        userId,
        workoutLogId: input.id,
      },
    });
  }),
  updateWorkout:  protectedProcedure.input(z.object({ date: z.string().datetime(), exercise: z.string(), reps: z.number().int(), weight: z.number(), id: z.string()  }))
  .mutation(async ({ ctx, input }) => {
    // simulate a slow db call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!ctx.session || !ctx.session.user) {
      throw new Error('Unauthorized');
    }

    const userId = ctx.session?.user.id;

    console.log('userId', userId);

    return ctx.db.liftingLogGrid.update({
      where: { workoutLogId: input.id }, 
      data: {
        userId,
        date: input.date,
        exercise: input.exercise,
        reps: input.reps,
        weight: input.weight,
        workoutLogId: input.id,
      },
    });
  }),
});