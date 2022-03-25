import { createSlice } from "@reduxjs/toolkit";

import { loadWorldData, loadCodes } from "../../helpers/functions";

import isoData from '../../data/iso.json'

const data = loadWorldData();

console.log(data);

export const dataSlice = createSlice({
  name: "data",
  initialState: [],
  reducers: {
    loadData: (state, payload) => {
      state.data = data;
    }
  }
});


export const {loadData} = dataSlice.actions;

export default dataSlice.reducer


