import { configureStore} from '@reduxjs/toolkit'
import accountReducer from '../redux/account/accountSlice'


export default configureStore({
  reducer: {
    account: accountReducer
  }
})