import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firebase from '@react-native-firebase/auth'; 

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginWithEmailAndPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmailAndPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithEmailAndPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ... autres cas pour loginWithPhoneNumber, loginWithGoogle, etc.
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

// Fonctions asynchrones pour l'authentification
export const loginWithEmailAndPassword = createAsyncThunk(
  'auth/loginWithEmailAndPassword',
  async (credentials) => {
    try {
      const userCredential = await firebase().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }
);

// ... (autres fonctions asynchrones pour loginWithPhoneNumber, loginWithGoogle, etc.)

export default authSlice.reducer;