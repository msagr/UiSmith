/* eslint-disable */

import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import prisma from '@/lib/db';
import { z } from 'zod';
import { inngest } from '@/inngest/client';
import { generateSlug } from 'random-word-slugs';

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: 'asc',
      },
    });
    return projects;
  }),
  create: baseProcedure
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
