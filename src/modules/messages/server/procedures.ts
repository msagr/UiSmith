/* eslint-disable */

import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import prisma from '@/lib/db';
import { z } from 'zod';
import { inngest } from '@/inngest/client';

export const messageRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const messages = await prisma.message.findMany({
      orderBy: {
        updatedAt: 'asc',
      },
      include: {
        fragment: true,
      },
    });
    return messages;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: 'Message is required' }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const createdMessage = await prisma.message.create({
          data: {
            content: input.value,
            role: 'USER',
            type: 'RESULT',
          },
        });

        await inngest.send({
          name: 'code-agent/run',
          data: {
            value: input.value,
          },
        });

        return createdMessage;
      } catch (err) {
        console.error('Error in messages.create:', err);
        throw err;
      }
    }),
});
