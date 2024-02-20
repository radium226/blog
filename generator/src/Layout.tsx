import { ReactNode } from "react";


export interface LayoutProps {
    pageName: string,
    children: ReactNode,
}

export default function Layout({ pageName, children }: LayoutProps) {
    return (
        <html>
            <body>
                <main id="root">
                    { children }
                </main>
                <script src={ `./${pageName}.js` } type="application/javascript"></script>
            </body>
        </html>
    )
}