/* eslint-disable */

import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
import { messageRouter } from '@/modules/messages/server/procedures';
import { projectsRouter } from './../../modules/projects/server/procedure';

// export const appRouter = createTRPCRouter({
//   invoke: baseProcedure
//     .input(
//       z.object({
//         value: z.string(),
//       })
//     )
//     .mutation(async ({ input }) => {
//       await inngest.send({
//         name: 'test/hello.world',
//         data: {
//           value: input.value,
//         },
//       });
//     }),
//   hello: baseProcedure
//     .input(
//       z.object({
//         text: z.string(),
//       })
//     )
//     .query((opts) => {
//       return {
//         greeting: `hello ${opts.input.text}`,
//       };
//     }),
// });
// // export type definition of API
// export type AppRouter = typeof appRouter;

export const appRouter = createTRPCRouter({
  messages: messageRouter,
  projects: projectsRouter,
});

export type AppRouter = typeof appRouter;
