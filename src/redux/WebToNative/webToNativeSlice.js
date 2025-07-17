import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialState = {
    platform: 'Browser',
};

const wtnSlice = createSlice({
    name: 'wtn',
    initialState,
    reducers: {
        setMobileConfig(state, action) {
            console.log("state",action.payload.platform)
            state.platform = action.payload.platform;
        },
    },
});

export const wtnStore = configureStore({
    reducer: {
        wtn: wtnSlice.reducer,
    },
});

export const { setMobileConfig } = wtnSlice.actions;


export default wtnSlice.reducer; 