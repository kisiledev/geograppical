import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: [],
  scores: []
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    addAccountData: (state, action) => {
      
    },
    removeAccountData: (state, action) => {

    },
  }
})

export const { addAccountData, removeAccountData } = accountSlice.actions

export default accountSlice.reducer