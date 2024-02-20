import esbuild from 'esbuild'
import mdx from '@mdx-js/esbuild'
import { glob } from 'glob'
import path from 'path'
import fs from 'fs/promises'
import ReactDOMServer from 'react-dom/server';
import { Fragment } from 'react'
import * as prettier from "prettier";
import Layout from './Layout'
import remarkFrontmatter from 'remark-frontmatter'


import {compile, run, evaluate} from '@mdx-js/mdx'

import { read } from 'to-vfile'
import { matter } from 'vfile-matter'

import * as runtime from 'react/jsx-runtime';

import Strong from './Strong'

import { MDXProvider, useMDXComponents } from '@mdx-js/react'

export interface GenerateConfig {
    inputFolderPath?: string,
    outputFolderPath?: string,
    tempFolderPath?: string,
}


export async function generate(config: GenerateConfig = {}): Promise<void> {
    const { inputFolderPath, tempFolderPath, outputFolderPath} = {
        inputFolderPath: './blog/input',
        outputFolderPath: './blog/output',
        tempFolderPath: './blog/temp',
        ...config,
    }

    const inputFilePaths = await glob(`${inputFolderPath}/**/*.md`)
    for (const inputFilePath of inputFilePaths) {
        console.log(`inputFilePath: ${inputFilePath}`)

        const pageName = path.parse(inputFilePath).name
        
        console.log(` --> Generating HTML...`)
        const markdownContent = await fs.readFile(inputFilePath, 'utf-8')

        const vfile = await read(inputFilePath)
        matter(vfile)
        console.log(vfile.data.matter)

        // @ts-expect-error
        const { default: Content } = await evaluate(markdownContent, {
            ...runtime,
            remarkPlugins: [remarkFrontmatter],
        })

        const components = {
            Strong,
        }

        const htmlContent = ReactDOMServer.renderToString(
            <Layout pageName={ pageName }>
                <Content components={components}/>
            </Layout>
        )

        const prettyHTMLContent = `<!DOCTYPE html>\n${htmlContent}`; // await prettier.format(htmlContent, { parser: "html" })

        const htmlFilePath = path.join(
            outputFolderPath,
            path.relative(inputFolderPath, inputFilePath).replace(/\.mdx?$/, '.html')
        )

        await fs.writeFile(htmlFilePath, prettyHTMLContent, 'utf-8')

        console.log(` --> Generating JS...`)
        await fs.mkdir(
            path.join(
                tempFolderPath ?? "blog/temp",
                pageName
            ), 
            { recursive: true }
        )
        
        const jsxContent = `
            import ReactDOM from 'react-dom';
            import { hydrateRoot } from 'react-dom/client'

            import Content from './Content.js'
            import Layout from './Layout.js'
            import Strong from './Strong.js'

            const root = document.getElementById("root")
            hydrateRoot(root, <Content components={ {
                Strong: Strong,
            } } />)
        `

        await esbuild.build({
            entryPoints: ['./src/Layout.tsx'],
            logLevel: 'debug',
            outfile: path.join(
                tempFolderPath ?? "blog/temp",
                pageName,
                "Layout.js",
            ),
            plugins: [mdx({
                mdExtensions: [],
                mdxExtensions: ['.mdx', '.md'],
                remarkPlugins: [remarkFrontmatter],
            })]
        })

        await esbuild.build({
            entryPoints: ['./src/Strong.tsx'],
            logLevel: 'debug',
            outfile: path.join(
                tempFolderPath ?? "blog/temp",
                pageName,
                "Strong.js",
            ),
            plugins: [mdx({
                mdExtensions: [],
                mdxExtensions: ['.mdx', '.md'],
                remarkPlugins: [remarkFrontmatter],
            })]
        })

        const jsxFilePath = path.join(
            tempFolderPath ?? "blog/temp",
            pageName,
            "bundle.jsx",
        )
        await fs.writeFile(jsxFilePath, jsxContent, 'utf-8')

        console.log(` --> Compiling Markdown to JS...`)
        await esbuild.build({
            entryPoints: [inputFilePath],
            logLevel: 'debug',
            outfile: path.join(
                tempFolderPath ?? "blog/temp",
                pageName,
                "Content.js",
            ),
            plugins: [mdx({
                mdExtensions: [],
                mdxExtensions: ['.mdx', '.md'],
                remarkPlugins: [remarkFrontmatter],
            })]
        })

        console.log(` --> Bundleing...`)
        await esbuild.build({
            entryPoints: [jsxFilePath],
            logLevel: 'debug',
            outfile: path.join(
                outputFolderPath,
                `${pageName}.js`,
            ),
            bundle: true,
            plugins: [mdx({
                mdExtensions: [],
                mdxExtensions: ['.mdx', '.md'],
                remarkPlugins: [remarkFrontmatter],
            })]
        })
    }
}