import { ReactNode } from 'react';
import { Article } from '@blog/domain';


export interface LayoutProps {
    children: ReactNode
    title?: string
    slug: string
    articles: Article[]
    baseURL?: string
}

export default function Layout({ baseURL, articles, title, slug, children }: LayoutProps) {
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
                <main>
                    <aside>
                        <nav>
                            <ul>
                                { articles.map(({ slug }) =>
                                    <li>
                                        <a href={ `./${slug}.html` }>{ slug }</a>
                                    </li>
                                ) }
                            </ul>
                        </nav>
                    </aside>
                    <section id="root">
                        {children}
                    </section>
                </main>
                <script type="module" src={ `${slug}.js` }></script>
            </body>
        </html>
    )
}