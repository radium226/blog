#!/usr/bin/env node

import { command, run, string, number, positional, subcommands, option } from 'cmd-ts';

import { serve } from './serve';
import { generate } from './generate';


const serveCommand = command({
  name: 'serve',
  args: {
    host: option({ 
      type: string, 
      long: 'host', 
      short: 'h', 
      defaultValue: () => 'localhost', 
    }),
    port: option({ 
      type: number, 
      long: 'port', 
      short: 'p', 
      defaultValue: () => 8765, 
    }),
    inputFolderPath: positional({
      type: string, 
    }),
  },
  handler: async ({ host, port, inputFolderPath }) => {
    await serve(host, port, inputFolderPath)
  },
})

const generateCommand = command({
  name: 'generate',
  args: {
    inputFolderPath: positional({ type: string }),
    outputFolderPath: positional({ type: string }),
  },
  handler: async ({ inputFolderPath, outputFolderPath }) => {
    await generate(inputFolderPath, outputFolderPath)
  },
})

const app = subcommands({
  name: 'blog',
  cmds: { 
    'serve': serveCommand, 
    'generate': generateCommand, 
  },
});

run(app, process.argv.slice(2))