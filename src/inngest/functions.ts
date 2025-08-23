import { Sandbox } from '@e2b/code-interpreter';
import { inngest } from './client';
import { openai, createAgent } from '@inngest/agent-kit';
import { getSandbox } from './utils';

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
      system: 'You are an expert summarizer.  You summarize in 2 words.',
      model: openai({ model: 'gpt-4o' }),
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
