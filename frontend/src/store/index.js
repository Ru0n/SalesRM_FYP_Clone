import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leaveReducer from './slices/leaveSlice';
import expenseReducer from './slices/expenseSlice';
import contactReducer from './slices/contactSlice';
import dcrReducer from './slices/dcrSlice';
import tourProgramReducer from './slices/tourProgramSlice';
import notificationReducer from './slices/notificationSlice';
import reportingReducer from './slices/reportingSlice';
import userReducer from './slices/userSlice';
import analyticsReducer from './slices/analyticsSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    leave: leaveReducer,
    expense: expenseReducer,
    contact: contactReducer,
    dcr: dcrReducer,
    tourProgram: tourProgramReducer,
    notification: notificationReducer,
    reporting: reportingReducer,
    user: userReducer,
    analytics: analyticsReducer,  },
});