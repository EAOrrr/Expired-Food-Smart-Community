import { Navigate, Route, Routes } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/Login"
import SignUp from "./components/Signup"
import { initializeUser } from "./reducers/userReducer"
import NotificationDisplay from "./components/NotificationDisplay"
import ShoppingPage from './components/ShoppingPage'
import Cart from './components/Cart'
import Order from './components/Order'

function App() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute authorize={false}></ProtectedRoute>} />
      <Route path='/login' element={!user.loading && user.info ? <Navigate to='/'/> : <Login />} />
      <Route path='/sign-up' element={!user.loading && user.info ? <Navigate to='/'/> : <SignUp />} />
      <Route path='/test' element={<ProtectedRoute><NotificationDisplay /></ProtectedRoute>} />
      <Route path='/shopping' element={<ShoppingPage />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/orders' element={<ProtectedRoute><Order /></ProtectedRoute>} />
    </Routes>
  )
}

export default App