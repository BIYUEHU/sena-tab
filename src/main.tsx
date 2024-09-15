import { createRoot } from 'react-dom/client'
// import '../node_modules/mdui/mdui.css'
import App from '@/App.tsx'
import { StrictMode } from 'react'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
