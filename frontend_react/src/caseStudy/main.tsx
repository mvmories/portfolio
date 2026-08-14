import React from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource-variable/dm-sans'
import '@fontsource-variable/plus-jakarta-sans'

import PowerByJS from './PowerByJS'
import '../styles/global.scss'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')

createRoot(container).render(
  <React.StrictMode>
    <PowerByJS />
  </React.StrictMode>
)
