import { renderToString } from 'react-dom/server';
import { slugify } from './slugify';
import fs from 'fs/promises'
import {compile, run, evaluate} from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime';

import * as components from '@blog/components'

import Layout, { LayoutProps } from '@blog/layout'


export async function generateHTML(markdownFilePath: string, outputFolderPath: string) {
    const markdownContent = await fs.readFile(markdownFilePath, 'utf-8')

    // @ts-expect-error
    const { default: Content } = await evaluate(markdownContent, {
        ...runtime,
    })

    const slug = slugify(markdownFilePath)
    const htmlContent = "<!DOCTYPE html>\n" + renderToString(
        <Layout slug={slug}>
            <Content components={ components } />
        </Layout>
    )
    const outputFilePath = `${outputFolderPath}/${slug}.html`
    await fs.writeFile(outputFilePath, htmlContent)
}