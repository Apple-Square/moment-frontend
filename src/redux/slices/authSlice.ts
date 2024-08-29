import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosInstance} from '../../lib/axiosInstance.ts';
import {loginRequest} from "../../pages/auth/function/userAxios.ts"
import {NavigateFunction} from "react-router-dom";
import _ from "lodash";
import {AuthState, LoginThunkArgs} from "../../interface/OtherInterface.ts";
import {JSONColor} from "../../lib/deepLog.ts";




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
    async ({ loginState }: LoginThunkArgs, thunkAPI) => {
        try{
            console.log("loginState :: "+ JSON.stringify(loginState));
            let reformedResponse : any = {};
            if(loginState){
                const response = await loginRequest({
                    username : loginState.username,
                    password : loginState.password
                });
                console.log(JSONColor.stringify(response));
                console.log(JSON.stringify(response));
                if(response?.data?.user){
                    loginState = _.merge(loginState, response?.data?.user);//response.data.user 우선시 됨
                    reformedResponse = _.merge(response, {data: {user: loginState}});
                }
            }
            console.log(`reformedResponse :: ${JSONColor.stringify(reformedResponse)}`);

            if(reformedResponse?.data?.user){
                return thunkAPI.fulfillWithValue(reformedResponse);
            }

        } catch (error) {
            console.log(JSON.stringify(error, null, 2));
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
                state.user = action.payload.data.user;
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
                state.user = null;
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.error.message || '로그아웃 실패 :: 에러메세지 없음';
            });
    }
})

export default authSlice.reducer;