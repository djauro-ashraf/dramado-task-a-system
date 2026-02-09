import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import AppRouter from './app/router'
import Toast from './ui/Toast'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toast />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
