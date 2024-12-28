import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './slices/accountSlice';

export const store = configureStore({
    reducer: {
        account: accountReducer,
    },
});

// Export types để sử dụng với TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;