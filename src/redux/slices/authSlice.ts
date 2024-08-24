import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosInstance from '../../lib/axiosInstance.ts';
import {LoginState, User} from "../../pages/auth/interface/DomainInterface.ts";
import {login} from "../../pages/auth/function/userAxios.ts"
import {NavigateFunction} from "react-router-dom";


export interface LoginThunkArgs {
    loginState: LoginState | null;
    navigate: NavigateFunction;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isRedirected : boolean;
    loading: boolean;
    error: unknown;
}
/**
 * ```
 * export interface LoginThunkArgs {
 *     loginState: LoginState | null;
 *     navigate: NavigateFunction;
 * }
 *```
 * ```
 * export interface AuthState {
 *     user: User | null;
 *     isAuthenticated: boolean;
 *     isRedirected : boolean;
 *     loading: boolean;
 *     error: unknown;
 * }
 * ```
 */
export const loginThunk
    = createAsyncThunk("auth/login",
    async ({ loginState, navigate }: LoginThunkArgs, thunkAPI) => {
        try{
            console.log(loginState,navigate);

            let response : any = {};

            if(loginState){
                response = await login({
                    username : loginState.username,
                    password : loginState.password
                });
            }
            return thunkAPI.fulfillWithValue(response);

        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error);
        }
})

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auth/logout');

            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            console.error("로그아웃 실패 :: ", error);
            return thunkAPI.rejectWithValue(error || "Unknown error");
        }
    }
);

const initialState : AuthState = {
    user : {
        nickname : "",
        username : "",
        password : "",
        birth : "",
        gender : "",
        email : "",
        address : "",
        profilePhotoUrl : "",
        profileIntro: "",
    },
    isAuthenticated: false,
    isRedirected: true, // 리다이렉트 한 번 하면 false가 됨.
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    //동기작업
    reducers: {
        setUser : (state, action) => {
            state.user = action.payload;
        },
        setAuthentication : (state , action) => {
            state.isAuthenticated = action.payload;
        },
        setIsRedirect: (state, action) => {
            state.isRedirected = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
    //비동기작업
    extraReducers: (builder) => {
        builder
            .addCase(logoutThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || '로그아웃 실패 :: 에러메세지 없음';
            });
    }
})

export default authSlice.reducer;