import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import persistStorage from 'redux-persist/lib/storage' // defaults to localStorage for web
import authReducer from "./slices/authSlice";
import counterReducer from "./slices/counter";
import clientsReducer from './slices/clientsSlice';
// import jobsReducer from "./slices/jobsSlice";
import tasksReducer from './slices/tasksSlice';
import rolesReducer from './slices/roleSlice';
import { apiSlice } from "./slices/apiSlice";

const persistConfig = {
  key: 'jarvis-1.1.0',
  storage: persistStorage,
  //stateReconciler: autoMergeLevel2
}


const rootReducer = combineReducers({
  counter: counterReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  clients: clientsReducer,
  // jobs: jobsReducer,
  tasks: tasksReducer,
  roles: rolesReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
});

export const persistor = persistStore(store);
//export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
