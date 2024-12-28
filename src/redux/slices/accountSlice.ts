import { callFetchAccount } from '@/config/api';
import { IAccount } from '@/types/backend';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async () => {
        const response = await callFetchAccount();
        return response.data?.user;
    }
)

interface AccountState {
    id: number;
    email: string;
    name: string;
    role: string;
    isAuthenticated: boolean;
    isLoading: boolean
}

const initialState: AccountState = {
    id: -1,
    email: '',
    name: '',
    role: '',
    isAuthenticated: false,
    isLoading: false
};

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setUerLoginInfor: (state, action: PayloadAction<IAccount>) => {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.role = action.payload.role;
            if (action.payload.role === 'ADMIN') state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchAccount.pending, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false;
                state.isLoading = true;
            }
        })

        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.id = action.payload.id;
                state.email = action.payload.email;
                state.name = action.payload.name;
                state.role = action.payload.role;
            }
        })

        builder.addCase(fetchAccount.rejected, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false;
                state.isLoading = false;
            }
        })
    },
});

export const { setUerLoginInfor } = accountSlice.actions;
export default accountSlice.reducer;