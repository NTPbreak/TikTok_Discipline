import { configureStore } from '@reduxjs/toolkit'
import authSlicer from './slices/counter'
import timer from "./slices/timer"
export const store = configureStore(
    {
        reducer:{
            auth: authSlicer,
            timer:timer
        },
    }
)


export type RootState  = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch