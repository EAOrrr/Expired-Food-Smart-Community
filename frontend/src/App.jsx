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
import Profile from './components/Profile'
import BillsPage from './components/BillsPage'
import UserProfile from "./components/UserProfile"

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

      <Route path= '/products/:id' element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
      {/* 包括他人的基本信息，他人的评论，(商品)等 /} 
      {/ <Route path='/users/:id' element={<ProtectedRoute> <></> </ProtectedRoute>} /> */}
      {/* <Route path='/users/:id' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} /> */}
      <Route path = '/users/:id' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path='/carts' element={<ProtectedRoute><CartsPage /></ProtectedRoute>} />
      <Route path='/orders' element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path='/bills' element={<ProtectedRoute><BillsPage /></ProtectedRoute>} />

      {/* 展示用户的商品列表，可在此创建商品、修改商品、删除商品 */}
      {/* <Route path='/my-products' element={<ProtectedRoute> <></> </ProtectedRoute>} /> */}
      {/* 展示评论列表，包括自己对他人的评论（可删除）和他人对自己的评论（不可删除） */}
      {/* <Route path='/reviews' element={<ProtectedRoute> <></> </ProtectedRoute>} /> */}

      {/* 测试专用 */}
      {/* <Route path='/test' element={<ProtectedRoute> <NotificationDisplay /> </ProtectedRoute>} /> */}
      <Route path='/test' element={<NotificationDisplay />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}

export default App