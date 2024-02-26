import fs from 'fs/promises';
import { existsSync } from 'fs';
import { createServer } from 'http';
import path from 'path'
import { slugify } from './slugify';
import { glob } from 'glob'
import { Article } from '@blog/domain'
import { generateWebsite } from '@blog/generator';


async function fileExists(filePath: string): Promise<boolean> {
    return existsSync(filePath)
}

export async function serve(host: string, port: number, inputFolderPath: string): Promise<void> {
    const types: { [key: string]: string; } = {
        html: 'text/html',
        css: 'text/css',
        js: 'application/javascript',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
        json: 'application/json',
        xml: 'application/xml',
    };
    const server = createServer(async (request, response) => {
        const tempFolderPath = path.join('/tmp', 'blog', 'serve')
        if (request.url !== undefined) {
            const requestedSlug = path.parse(request.url).name
            const inputFilePaths: string[] = await glob(`${inputFolderPath}/*.md`, { absolute: true })
            const articles: Article[] = await Promise.all(inputFilePaths
                .map((inputFilePath) => ({ 
                    inputFilePath, 
                    slug: slugify(path.parse(inputFilePath).name)
                }))
                .filter(({ slug }) => slug === requestedSlug)
                .map(async ({ slug, inputFilePath }) => {
                    const markdownContent = await fs.readFile(inputFilePath, 'utf-8')
                    return {
                      slug,
                      markdownContent,
                    }
                  }))
            
            await generateWebsite(articles, tempFolderPath)

            const filePath = path.join(tempFolderPath, request.url === '/' ? '/index.html' : request.url)
            if (await fileExists(filePath)) {
                response.writeHead(200, { 'Content-Type': types[path.parse(request.url).ext.slice(1)] })
                const fileContent = await fs.readFile(filePath)
                response.write(fileContent)
                response.end()
            } else {
                response.writeHead(404)
                response.end()
            }
        } else {
            response.writeHead(404)
            response.end()
        }

        
    })

    return new Promise((resolve, reject) => {
        server.listen(port, host, () => {
            console.log("Listening! ")
            resolve()
        })
    })
}