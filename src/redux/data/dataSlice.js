import { createSlice } from '@reduxjs/toolkit';

import { loadWorldData, loadCodes } from '../../helpers/functions';

import isoData from '../../data/iso.json';

const data = await loadWorldData();

console.log(data);
console.log(isoData);
export const dataSlice = createSlice({
  name: 'data',
  initialState: isoData,
  reducers: {
    loadData: (state, payload) => {
      state.data = data;
    }
  }
});

export const { loadData } = dataSlice.actions;

export default dataSlice.reducer;
