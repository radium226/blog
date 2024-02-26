import { ReactNode } from 'react';


export interface LayoutProps {
    children: ReactNode
    title?: string
    slug: string
}

export default function Layout({ title, slug, children }: LayoutProps) {
    return (
        <html>
            <head>
                <title>{ title ?? slug }</title>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
                />
            </head>
            <body>
                <main id="root">
                    {children}
                </main>
                <script type="module" src={ `${slug}.js` }></script>
            </body>
        </html>
    )
}