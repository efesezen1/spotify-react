import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slicers/userSlice'
const store = configureStore({
   reducer: { user: userReducer },
})

export default store
