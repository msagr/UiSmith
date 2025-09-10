/* eslint-disable */

import 'dotenv/config';
import { Sandbox } from '@e2b/code-interpreter';

async function main() {
  console.log('E2B_API_KEY:', process.env.E2B_API_KEY);
  const sbx = await Sandbox.create();
  console.log('Sandbox ID: ', sbx.sandboxId);

  // sandbox info
  const info = await sbx.getInfo();
  console.log(info);

  const execution = await sbx.runCode('print("hello world")');
  console.log(execution.logs);

  const files = await sbx.files.list('/');
  console.log(files);
}

main();
