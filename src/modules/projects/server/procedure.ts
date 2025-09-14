/* eslint-disable */

import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import prisma from '@/lib/db';
import { z } from 'zod';
import { inngest } from '@/inngest/client';
import { generateSlug } from 'random-word-slugs';
import { TRPCError } from '@trpc/server';

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: 'Id is required' }),
      })
    )
    .query(async ({ input }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return existingProject;
    }),
  getMany: protectedProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: 'asc',
      },
    });
    return projects;
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: 'Prompt is required' })
          .max(10000, { message: 'Prompt is too long' }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const createdProject = await prisma.project.create({
          data: {
            name: generateSlug(2, {
              format: 'kebab',
            }),
            messages: {
              create: {
                content: input.value,
                role: 'USER',
                type: 'RESULT',
              },
            },
          },
        });

        await inngest.send({
          name: 'code-agent/run',
          data: {
            value: input.value,
            projectId: createdProject.id,
          },
        });

        return createdProject;
      } catch (err) {
        console.error('Error in messages.create:', err);
        throw err;
      }
    }),
});
