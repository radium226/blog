import { compile } from '@mdx-js/mdx';
import dedent from 'dedent'
import esbuild from 'esbuild'
import mdx from '@mdx-js/esbuild'
import * as runtime from 'react/jsx-runtime';
import fs from 'fs/promises'
import { slugify } from './slugify';
import path from 'path';

export async function generateJS(markdownFilePath: string, outputFolderPath: string) {
    const markdownContent = await fs.readFile(markdownFilePath, 'utf-8')


    const { value: reactContent} = await compile(markdownContent, {
        // ...runtime,
    })

    fs.writeFile("/tmp/Content.js", reactContent, 'utf-8')

    const jsxContent = dedent(`
        import React, { StrictMode } from 'react'
        import { hydrateRoot } from 'react-dom/client'
        import Content from './Content.js'

        import * as components from '@blog/components'

        const root = document.getElementById("root")
        hydrateRoot(root, <StrictMode><Content components={ components } /></StrictMode>)
    `)

    const slug = slugify(markdownFilePath)


    const tempFilePath = path.join("/tmp", `${slug}.jsx`)
    fs.writeFile(tempFilePath, jsxContent, 'utf-8')
    const outputFilePath = path.join(outputFolderPath, `${slug}.js`)

    const nodePath = path.join(__dirname, "..", "..", "..", "node_modules")
    console.log(nodePath)

    await esbuild.build({
        nodePaths: [nodePath],
        entryPoints: [tempFilePath],
        logLevel: 'debug',
        outfile: outputFilePath,
        bundle: true,
    })
}