import { generateWebsite } from '@blog/generator';
import { Article } from '@blog/domain';
import { glob } from 'glob'
import fs from 'fs/promises'
import slugify from 'slugify';
import path from 'path';


export async function generate(inputFolderPath: string, outputFolderPath: string): Promise<void> {
    const inputFilePaths: string[] = await glob(`${inputFolderPath}/*.md`, { absolute: true })
    console.log("inputFilePaths: ", inputFilePaths)
    const articles: Article[] = await Promise.all(inputFilePaths
      .map(async (inputFilePath) => {
        const markdownContent = await fs.readFile(inputFilePath, 'utf-8')
        return {
          slug: slugify(path.parse(inputFilePath).name, {
            remove: /[*+~.()'"!:@]/g,
            lower: true,
          }),
          markdownContent,
        }
      }))

    generateWebsite(articles, outputFolderPath)
}