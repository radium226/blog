import { Article } from '@blog/domain'
import path from 'path'
import fs from 'fs/promises'
import { compile } from '@mdx-js/mdx';
import dedent from 'dedent'


export async function generateWebsite(articles: Article[], outputFolderPath: string) {
    const tempFolderPath = path.join('/tmp', 'blog', 'website')
    await fs.mkdir(tempFolderPath, { recursive: true })

    for (const article of articles) {
        const { slug, markdownContent } = article
        const compnentName = generateComponentName(slug)
        const componentFilePath = path.join(tempFolderPath, `${compnentName}.js`)
        const { value: componentContent} = await compile(markdownContent, {
            // ...runtime,
        })

        await fs.writeFile(componentFilePath, componentContent, 'utf-8')

        const jsxContent = dedent(`
            import React, { StrictMode } from 'react'
            import { hydrateRoot } from 'react-dom/client'
            import Content from './${compnentName}.js'

            import * as components from '@blog/components'

            const root = document.getElementById("root")
            hydrateRoot(root, <StrictMode><${compnentName} components={ components } /></StrictMode>)
        `)

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