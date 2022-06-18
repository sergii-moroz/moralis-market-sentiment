import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { MoralisProvider } from "react-moralis"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MoralisProvider appId="3MIog3Xmvv6RFzv0EcMKcJTHozyqrbnDPqyaQNrh" serverUrl="https://bqbnr35sckfk.usemoralis.com:2053/server">
      <App />
    </MoralisProvider>
  </React.StrictMode>
)
