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
            </head>
            <body>
                <main>
                    {children}
                </main>
                <script src={ `${slug}.js` }></script>
            </body>
        </html>
    )
}