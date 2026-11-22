import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import { Show, SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/react'
import ChatPage from './pages/ChatPage'
import AuthPage from './pages/AuthPage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Loading from './components/Loading'

function App() {
  const {isSignedIn, isLoaded} = useAuth()
  const {clearAuth, isCheckingAuth, checkAuth} = useAuthStore();
  useEffect(()=>{
    if(!isLoaded) return;
    if(isSignedIn) checkAuth();
    else clearAuth();
  }, [checkAuth, clearAuth, isLoaded, isSignedIn]);
  if(!isLoaded || (isSignedIn && isCheckingAuth))  return <Loading/>
  return (
    <>
    <Routes>
      <Route path="/" element={isSignedIn ? <ChatPage/> : <Navigate to={"/auth"} replace />} />
      <Route path="/auth" element={!isSignedIn ? <AuthPage/> : <Navigate to={"/"} replace />}  />
    </Routes>
    <Toaster/>
    </>
  )
}

export default App