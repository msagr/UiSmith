/* eslint-disable */
import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { openai, createAgent } from '@inngest/agent-kit';

const codeAssistant = createAgent({
  name: 'code_assistant',
  system:
    'An AI assistant that helps answer questions about code by reading and analyzing files',
  model: openai({
    model: 'gpt-4o',
  }),
});

async function main() {
  const filePath = join(process.cwd(), `sandbox-test/index.ts`);
  const code = readFileSync(filePath, 'utf-8');

  const { output } = await codeAssistant.run(
    `What the following code does ? ${code}`
  );
  const lastMessage = output[output.length - 1];
  const content =
    lastMessage?.type === 'text' ? (lastMessage?.content as string) : undefined;
  console.log(content);
}

main();
