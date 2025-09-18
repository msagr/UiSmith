/* eslint-disable */

import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import prisma from '@/lib/db';
import { z } from 'zod';
import { inngest } from '@/inngest/client';
import { TRPCError } from '@trpc/server';
import { consumeCredits } from '@/lib/usage';

export const messageRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: 'Project id is required' }),
      })
    )
    .query(async ({ input, ctx }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: {
            userId: ctx.auth.userId,
          },
        },
        orderBy: {
          updatedAt: 'asc',
        },
        include: {
          fragment: true,
        },
      });
      return messages;
    }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: 'Message is required' })
          .max(10000, { message: 'Message is too long' }),
        projectId: z.string().min(1, { message: 'Project ID is required' }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const existingProject = await prisma.project.findUnique({
          where: {
            id: input.projectId,
            userId: ctx.auth.userId,
          },
        });

        if (!existingProject) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        try {
          await consumeCredits();
        } catch (error) {
          if (error instanceof Error) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Something went wrong',
            });
          } else {
            throw new TRPCError({
              code: 'TOO_MANY_REQUESTS',
              message: 'You have run out of credits',
            });
          }
        }

        const createdMessage = await prisma.message.create({
          data: {
            projectId: existingProject.id,
            content: input.value,
            role: 'USER',
            type: 'RESULT',
          },
        });

        await inngest.send({
          name: 'code-agent/run',
          data: {
            value: input.value,
            projectId: input.projectId,
          },
        });

        return createdMessage;
      } catch (err) {
        console.error('Error in messages.create:', err);
        throw err;
      }
    }),
});
