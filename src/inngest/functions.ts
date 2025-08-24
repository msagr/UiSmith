import { Sandbox } from '@e2b/code-interpreter';
import { inngest } from './client';
import { openai, createAgent } from '@inngest/agent-kit';
import { getSandbox } from './utils';
import { createTool } from '@inngest/agent-kit';
import { z } from 'zod';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    const sandboxId = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create('uismith-nextjs');
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: 'code-agent',
      system:
        'You are an expert next.js developer.  You write readable, maintainable code. You write simple Next.js & React snippets.',
      model: openai({ model: 'gpt-4o' }),
      tools: [
        createTool({
          name: 'terminal',
          description: 'Use the terminal to run commands',
          parameters: z.object({
            command: z.string(),
          }) as any,
          handler: async ({ command }, { step }) => {
            return await step?.run('terminal', async () => {
              const buffers = { stdout: '', stderr: '' };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (e) {
                console.error(
                  `Command failed: ${e} \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr} `
                );
                return `Command failed: ${e} \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr} `;
              }
            });
          },
        }),
        createTool({
          name: 'createOrUpdateFiles',
          description: 'Create or update files in sandbox',
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }) as any,
          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run(
              'createOrUpdateFiles',
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[files.path] = files.content;
                  }
                  return updatedFiles;
                } catch (e) {
                  return 'Error: ' + e;
                }
              }
            );

            if (typeof newFiles === 'object') {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: 'readFiles',
          description: 'Read files from the sandbox',
          parameters: z.object({
            files: z.array(z.string()),
          }) as any,
          handler: async ({ files }, { step }) => {
            return await step?.run('readFiles', async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (e) {
                return 'Error: ' + e;
              }
            });
          },
        }),
      ],
    });

    const { output } = await codeAgent.run(
      `Summarize following text: ${event.data.value}`
    );

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    console.log(output);

    // await step.sleep('wait-a-moment', '10s');
    return { output, sandboxUrl };
  }
);
