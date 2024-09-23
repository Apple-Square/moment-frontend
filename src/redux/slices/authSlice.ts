import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {axiosInstance, tokenManager} from '../../lib/axiosInstance.ts';
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

            if(isError(response)){
                return thunkAPI.rejectWithValue(getErrorMessage(response));
            }
            console.log("loginThunk에서 response :: "+ JSON.stringify(response, null, 2));
            tokenManager.setToken(response.token);
            console.log("로그인요청중 :: 베어러 토큰 - "+tokenManager.getToken());

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

/**
 * isRedirected는 로그인 안한 사람을 로그인페이지로 이동시킬 때 사용
 */
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
    // token : "",
    isAuthenticated: false,
    shouldRedirect: false, // 리다이렉트 필요하면 true, 그리고 !shouldRedirect라면 로직수행 다른 Redirect와 꼬이지 않게 해줌
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    //동기작업
    reducers: {
        setUser : (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload,
            };
            state.loading = false;
        },
        setRefresh : (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload.user,
            }
            state.isAuthenticated = action.payload.isAuthenticated;
            // state.isRedirected = action.payload.isRedirected;
            state.loading = action.payload.loading;
            state.error = action.payload.error;
        },
        // setToken : (state, action) => {
        //     state.token = action.payload;
        // },
        setUserAndToken : (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload.user,
            }
            state.loading = false;
            // state.token = action.payload.token;
        },
        setAuthentication : (state , action) => {
            state.isAuthenticated = action.payload;
            state.loading = false;
        },
        setShouldRedirect: (state, action) => {
            state.shouldRedirect = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
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
                // state.token = action.payload.token;
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
export const { setUser, setRefresh,setUserAndToken, setAuthentication, setShouldRedirect, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;