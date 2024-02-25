#!/usr/bin/env node

import { command, run, string, positional } from 'cmd-ts';
import { generateHTML, generateJS } from '@blog/generator';
import { glob } from 'glob'

const app = command({
  name: 'blog',
  args: {
    inputFolderPath: positional({ type: string }),
    outputFolderPath: positional({ type: string }),
  },
  handler: async ({ inputFolderPath, outputFolderPath }) => {
    const inputFilePaths = await glob(`${inputFolderPath}/*.md`, { absolute: true })
    for (const inputFilePath of inputFilePaths) {
        await generateHTML(inputFilePath, outputFolderPath)
        await generateJS(inputFilePath, outputFolderPath)
    }
  },
})

run(app, process.argv.slice(2))