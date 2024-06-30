import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface Timer {
    heure: number
    jourDeb: Date | null
    jourFin: Date | null
}

const initialState: Timer =
{
    heure : 0,
    jourDeb : null,
    jourFin : null
}

export const timerSlice = createSlice
(

    {
        name:"timer",
        initialState,
        reducers:{
            initialiseHeure(state)
            {
                state.heure = new Date().getHours()
            }
        }
    }
)

export const {initialiseHeure} = timerSlice.actions
export default timerSlice.reducer