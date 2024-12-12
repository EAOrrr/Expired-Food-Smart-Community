import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import notificationsReducer from './reducers/notificationReducer'


const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationsReducer,
  },
 
})

export default store