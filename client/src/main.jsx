import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { ServerUrl } from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import store from './redux/store.js'

// Safari and iPhone block the login cookie between two different websites,
// so the login token is also kept here and sent as a header to YOUR server only.
const TOKEN_KEY = "interviewiq_token"

const readToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) } catch (error) { return null }
}
const saveToken = (token) => {
  try { localStorage.setItem(TOKEN_KEY, token) } catch (error) { /* cookie will be used instead */ }
}
const clearToken = () => {
  try { localStorage.removeItem(TOKEN_KEY) } catch (error) { /* nothing to clear */ }
}

axios.interceptors.request.use((config) => {
  const token = readToken()
  if (token && config.url?.startsWith(ServerUrl)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  (response) => {
    const url = response.config.url || ""
    // After login: keep the token and hide it from the rest of the app
    if (url.includes("/api/auth/google") && response.data?.token) {
      saveToken(response.data.token)
      delete response.data.token
    }
    if (url.includes("/api/auth/logout")) clearToken()
    return response
  },
  (error) => {
    const url = error.config?.url || ""
    if (url.includes("/api/auth/logout")) clearToken()
    // An old or expired token when the page opens: forget it
    if (error.response?.status === 401 && url.includes("/api/user/current-user")) clearToken()
    return Promise.reject(error)
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <App />
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
