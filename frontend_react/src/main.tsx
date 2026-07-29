import React from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted rather than fetched from Google Fonts. The previous CSS
// `@import url(fonts.googleapis.com/...)` created a render-blocking request
// chain - HTML, then our stylesheet, then Google's stylesheet, then the font
// files - which held up first paint by ~800ms. Bundling it removes two hops and
// a third-party dependency, and the variable font covers every weight in one
// file. `font-display: swap` means text paints immediately regardless.
import '@fontsource-variable/dm-sans'

import App from './App'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
