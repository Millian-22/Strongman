import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { workoutLogRouter } from "./routers/workoutLog";
import { liftingLogGridRouter } from "./routers/liftingLogGrid";
import { openAIRouter } from "./routers/openAI";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  workoutLog: workoutLogRouter,
  liftingLog: liftingLogGridRouter,
  openAI: openAIRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
