import esbuild from 'esbuild'
import mdx from '@mdx-js/esbuild'
import { glob } from 'glob'
import path from 'path'
import fs from 'fs/promises'
import ReactDOMServer from 'react-dom/server';
import { Fragment } from 'react';

import {compile, run, evaluate} from '@mdx-js/mdx'

import * as runtime from 'react/jsx-runtime';

import Strong from './Strong'

import { MDXProvider, useMDXComponents } from '@mdx-js/react'

export interface GenerateConfig {
    inputFolderPath?: string,
    outputFolderPath?: string,
    workFolderPath?: string,
}

export function Blog({ children }: { children: React.ReactNode }) {
    const components = useMDXComponents({
        Strong,
    })

    return (
        <MDXProvider components={components}>{ children }</MDXProvider>
    )
}


export async function generate(config: GenerateConfig = {}): Promise<void> {
    const content = `
    # Hello...
    World! 

    <Strong>Coucou! </Strong>
    `

    const components = {
        Strong,
    }

    // @ts-ignore
    const { default: Content } = await evaluate(content, {
        ...runtime,
    })

    const code = ReactDOMServer.renderToStaticMarkup(
        <Content components={components}/>
    )

    console.log('code:', code)


    // const { inputFolderPath, workFolderPath, outputFolderPath} = {
    //     inputFolderPath: './blog/input',
    //     workFolderPath: './blog/work',
    //     outputFolderPath: './blog/output',
    //     ...config,
    // }

    // const inputFilePaths = await glob(`${inputFolderPath}/**/*.md`)
    // for (const inputFilePath of inputFilePaths) {
    //     console.log(`inputFilePath: ${inputFilePath}`)
    //     const workFolderPath =  path.join(
    //         (config.workFolderPath ?? "work"),
    //         "stage-01",
    //         path.parse(path.relative(inputFolderPath, inputFilePath)).name.replace(' ', '-').toLowerCase(),
    //     )
    //     await fs.mkdir(workFolderPath, { recursive: true })
    //     await esbuild.build({
    //         entryPoints: [inputFilePath],
    //         logLevel: 'debug',
    //         outfile: `${workFolderPath}/Article.js`,
    //         plugins: [mdx({
    //             mdExtensions: [],
    //             mdxExtensions: ['.mdx', '.md'],
    //         })]
    //     })

        
    // }



    // await esbuild.build({
    //     entryPoints: [`${inputFolderPath}/index.md`],
    //     logLevel: 'debug',
    //     outfile: `${outputFolderPath}/tmp/Page.js`,
    //     plugins: [mdx({
    //         mdExtensions: [],
    //         mdxExtensions: ['.mdx', '.md'],
    //     })]
    // })

    // await esbuild.build({
    //     entryPoints: [`src/Strong.tsx`],
    //     logLevel: 'debug',
    //     outfile: `${outputFolderPath}/tmp/Strong.js`,
    //     plugins: [mdx({
    //         mdExtensions: [],
    //         mdxExtensions: ['.mdx', '.md'],
    //     })]
    // })

    // await esbuild.build({
    //     entryPoints: [`src/main.tsx`],
    //     logLevel: 'debug',
    //     outfile: `${outputFolderPath}/tmp/main.js`,
    //     plugins: [mdx({
    //         mdExtensions: [],
    //         mdxExtensions: ['.mdx', '.md'],
    //     })]
    // })

    // await esbuild.build({
    //     entryPoints: [`${outputFolderPath}/tmp/main.js`],
    //     logLevel: 'debug',
    //     outfile: `${outputFolderPath}/bundle.js`,
    //     bundle: true,
    //     format: 'esm',
    //     plugins: [mdx({
    //         mdExtensions: [],
    //         mdxExtensions: ['.mdx', '.md'],
    //     })]
    // })

    // console.log('Done!')
}