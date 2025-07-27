import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider,extendTheme  } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#1a202c', // Dark background
        color: 'white'
      }
    }
  }
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
    <ChakraProvider theme={theme}>
    <App />
    </ChakraProvider>
    </RecoilRoot>
  </StrictMode>,
)
