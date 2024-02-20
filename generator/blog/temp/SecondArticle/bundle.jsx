
            import ReactDOM from 'react-dom';
            import { hydrateRoot } from 'react-dom/client'

            import Content from './Content.js'
            import Layout from './Layout.js'
            import Strong from './Strong.js'

            const root = document.getElementById("root")
            hydrateRoot(root, <Content components={ {
                Strong: Strong,
            } } />)
        