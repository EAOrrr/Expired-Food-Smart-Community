import { Navigate, Route, Routes } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/Login"
import SignUp from "./components/Signup"
import { initializeUser } from "./reducers/userReducer"
import NotificationDisplay from "./components/NotificationDisplay"
import ShoppingPage from './components/ShoppingPage'
import CartsPage from './components/CartsPage'
import OrdersPage from './components/OrdersPage'
import ProductPage from "./components/ProductPage"

function App() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute authorize={false}><ShoppingPage /></ProtectedRoute>} />
      <Route path='/login' element={!user.loading && user.info ? <Navigate to='/'/> : <Login />} />
      <Route path='/sign-up' element={!user.loading && user.info ? <Navigate to='/'/> : <SignUp />} />
      <Route path='/test' element={<ProtectedRoute> <NotificationDisplay /> </ProtectedRoute>} />
      {/* <Route path='/shopping' element={<ProtectedRoute> <ShoppingPage /> </ProtectedRoute>} /> */}
      <Route path= '/products/:id' element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
      <Route path='/carts' element={<ProtectedRoute><CartsPage /></ProtectedRoute>} />
      <Route path='/orders' element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}

export default App