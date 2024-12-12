import { Navigate, Route, Routes } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/Login"
import SignUp from "./components/Signup"
import { initializeUser } from "./reducers/userReducer"


function App() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute></ProtectedRoute>} />
      <Route path='/login' element={!user.loading && user.info ? <Navigate to='/'/> : <Login />} />
      <Route path='/sign-up' element={!user.loading && user.info ? <Navigate to='/'/> : <SignUp />} />
    </Routes>
  )
}

export default App