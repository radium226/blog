import { Article } from '@blog/domain'
import Layout, { LayoutProps } from '@blog/layout'
import path from 'path'
import fs from 'fs/promises'
import { compile, evaluate } from '@mdx-js/mdx';
import dedent from 'dedent'
import esbuild from 'esbuild'
import { renderToString } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import * as components from '@blog/components'


export async function generateWebsite(articles: Article[], outputFolderPath: string) {
    const tempFolderPath = path.join('/tmp', 'blog', 'website')
    await fs.mkdir(tempFolderPath, { recursive: true })

    const componentContentsByArticleSlug = new Map<string, string | Uint8Array>()
    for (const  { slug, markdownContent } of articles) {
        const compnentName = generateComponentName(slug)
        const componentFilePath = path.join(tempFolderPath, `${compnentName}.js`)
        const { value: componentContent} = await compile(markdownContent, {
            // ...runtime,
        })
        console.log("Writing to: ", componentFilePath)
        await fs.writeFile(componentFilePath, componentContent, 'utf-8')

        const mainContent = dedent(`
            import React, { StrictMode } from 'react'
            import { hydrateRoot } from 'react-dom/client'
            import Content from './${compnentName}.js'

            import * as components from '@blog/components'

            const root = document.getElementById("root")
            hydrateRoot(root, <StrictMode><Content components={ components } /></StrictMode>)
        `)
        const mainContentFilePath = path.join(tempFolderPath, `${slug}.jsx`)
        console.log("Writing to: ", mainContentFilePath)
        await fs.writeFile(mainContentFilePath, mainContent, 'utf-8')

        componentContentsByArticleSlug.set(slug, componentContent)
    }

    const nodePath = path.join(__dirname, "..", "..", "..", "node_modules")
    await esbuild.build({
        nodePaths: [nodePath],
        entryPoints: articles.map(({ slug }) => path.join(tempFolderPath, `${slug}.jsx`)),
        splitting: true,
        logLevel: 'debug',
        outdir: outputFolderPath,
        format: 'esm',
        bundle: true,
    })

    for (const { slug, markdownContent } of articles) {
        console.log("Generating HTML for slug: ", slug)
        // @ts-expect-error
        const { default: Content } = await evaluate(markdownContent, {
            ...runtime,
        })
        const htmlContent = "<!DOCTYPE html>\n" + renderToString(
            <Layout articles={ articles } slug={slug}>
                <Content components={ components } />
            </Layout>
        )
        const outputFilePath = `${outputFolderPath}/${slug}.html`
        await fs.writeFile(outputFilePath, htmlContent)
    }
}

function generateComponentName(slug: string) {
    return toPascalCase(slug)
}

function toPascalCase(text: string) {
    return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text: string) {
    return text.replace(/-/, "").toUpperCase();
}