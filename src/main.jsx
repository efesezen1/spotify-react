import { createRoot } from 'react-dom/client'

import '@radix-ui/themes/styles.css'

import './index.css'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import App from './App'
createRoot(document.getElementById('root')).render(<App />)
