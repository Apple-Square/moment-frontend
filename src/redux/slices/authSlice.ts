import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosInstance} from '../../lib/axiosInstance.ts';
import {loginRequest, logoutRequest} from "../../pages/auth/function/authAxios.ts"
import {NavigateFunction} from "react-router-dom";
import _ from "lodash";
import {AuthState, LoginThunkArgs} from "../../interface/OtherInterface.ts";
import {JSONColor} from "../../lib/deepLog.ts";
import {produce, WritableDraft} from "immer";
import {getErrorMessage, isError} from "../../lib/ErrorUtil.ts";
import {merge} from "chart.js/helpers";




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
    async ( loginState : LoginThunkArgs, thunkAPI) => {
        try{
            console.log("loginState :: "+ JSON.stringify(loginState));

            if (!loginState?.username || !loginState?.password) {
                return thunkAPI.rejectWithValue("아이디와 비밀번호를 \n입력해주세요.");
            }

            const response = await loginRequest({
                username: loginState.username,
                password: loginState.password,
            });
            console.log("loginThunk에서 response :: "+ JSON.stringify(response, null, 2));

            if(isError(response)){
                return thunkAPI.rejectWithValue(getErrorMessage(response));
            }

            console.log(JSON.stringify(response, null, 2));
            return thunkAPI.fulfillWithValue(response);

        } catch (error) {
            console.log("loginThunk에서 에러");
            console.log(JSON.stringify(error, null, 2));
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
})

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            const response = await logoutRequest();

            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            console.error("로그아웃 실패 :: ", error);
            return thunkAPI.rejectWithValue(error || "알 수 없는 에러");
        }
    }
);

const initialState : AuthState = {
    user : {
        id : "",
        nickname : "",
        username : "",
        password : "",
        birth : "",
        gender : "",
        email : "",
        address : "",
        profileImage : "",
        profileIntro: "",
    },
    token : "",
    isAuthenticated: false,
    isRedirected: false, // 리다이렉트 한 번 하면 true가 됨.
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
        setToken : (state, action) => {
            state.token = action.payload;
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
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = {
                    ...state.user,
                    ...action.payload.data.user
                };
                state.token = action.payload.token;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.error.message || `로그인 실패 :: 에러메세지 없음`;
            })
            .addCase(logoutThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = {
                    id : "",
                    nickname : "",
                    username : "",
                    password : "",
                    birth : "",
                    gender : "",
                    email : "",
                    address : "",
                    profileImage : "",
                    profileIntro: "",
                };
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.error.message || '로그아웃 실패 :: 에러메세지 없음';
            });
    }
})

export default authSlice.reducer;