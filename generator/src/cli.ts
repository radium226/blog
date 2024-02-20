#!/usr/bin/env node

import { command, run, string, positional } from 'cmd-ts';
import { generate } from './generate.js';

const app = command({
  name: 'blog-generator',
  args: {},
  handler: async ({ }) => {
    await generate();
  },
});

run(app, process.argv.slice(2))