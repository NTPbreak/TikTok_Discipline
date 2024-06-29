import { configureStore } from '@reduxjs/toolkit'
import authSlicer from './slices/authSlicer'

export const store = configureStore(
    {
        reducer:{
            auth: authSlicer
        },
    }
)


export type RootState  = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch