/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseApp } from '../../firebase/firebase';

const db = getFirestore(firebaseApp);
const loadWorldData = async () => {
  const data = [];
  try {
    const querySnapshot = await getDocs(
      collection(db, ...'countries'.split('/'))
    );
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
  } catch (error) {
    console.log(error);
  }
  return data;
};
const data = await loadWorldData();

export const dataSlice = createSlice({
  name: 'data',
  initialState: [],
  reducers: {
    loadData: (state) => {
      state.data = data;
    }
  }
});

export const { loadData } = dataSlice.actions;

export default dataSlice.reducer;
