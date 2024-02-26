#!/usr/bin/env node

import { command, run, string, positional } from 'cmd-ts';
import { generateWebsite } from '@blog/generator';
import { Article } from '@blog/domain';
import { glob } from 'glob'
import fs from 'fs/promises'
import { slugify } from './slugify';
import path from 'path';

const app = command({
  name: 'blog',
  args: {
    inputFolderPath: positional({ type: string }),
    outputFolderPath: positional({ type: string }),
  },
  handler: async ({ inputFolderPath, outputFolderPath }) => {
    const inputFilePaths: string[] = await glob(`${inputFolderPath}/*.md`, { absolute: true })
    console.log("inputFilePaths: ", inputFilePaths)
    const articles: Article[] = await Promise.all(inputFilePaths
      .map(async (inputFilePath) => {
        const markdownContent = await fs.readFile(inputFilePath, 'utf-8')
        return {
          slug: slugify(path.parse(inputFilePath).name),
          markdownContent,
        }
      }))

    generateWebsite(articles, outputFolderPath)
  },
})

run(app, process.argv.slice(2))