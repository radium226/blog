import esbuild from 'esbuild'
import mdx from '@mdx-js/esbuild'

export interface GenerateConfig {
    inputFolderPath?: string,
    outputFolderPath?: string,
}


export async function generate(config: GenerateConfig = {}): Promise<void> {
    const { inputFolderPath, outputFolderPath} = {
        inputFolderPath: './blog/input',
        outputFolderPath: './blog/output',
        ...config,
    }

    await esbuild.build({
        entryPoints: [`${inputFolderPath}/index.mdx`],
        logLevel: 'debug',
        outfile: `${outputFolderPath}/tmp/Page.js`,
        plugins: [mdx({})]
    })

    await esbuild.build({
        entryPoints: [`src/Strong.tsx`],
        logLevel: 'debug',
        outfile: `${outputFolderPath}/tmp/Strong.js`,
        plugins: [mdx({})]
    })

    await esbuild.build({
        entryPoints: [`src/main.tsx`],
        logLevel: 'debug',
        outfile: `${outputFolderPath}/tmp/main.js`,
        plugins: [mdx({})]
    })

    await esbuild.build({
        entryPoints: [`${outputFolderPath}/tmp/main.js`],
        logLevel: 'debug',
        outfile: `${outputFolderPath}/bundle.js`,
        bundle: true,
        format: 'esm',
        plugins: [mdx({})]
    })

    console.log('Done!')
}