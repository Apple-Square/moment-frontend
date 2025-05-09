import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {tokenManager} from '../../lib/axiosInstance.ts';
import {loginRequest, logoutRequest} from "../../pages/auth/function/authAxios.ts"
import {AuthState, LoginThunkArgs, ThreeValueBoolean} from "../../interface/OtherInterface.ts";
import {gerServerErrorMessage, getErrorMessage, getErrorStatus, isError, setErrorMessage} from "../../lib/ErrorUtil.ts";
import {clearAllCookies} from "../../pages/common/function/cookie.ts";
import {isAxiosError} from "axios";
import axios, { AxiosError } from "axios";


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

            const response = await loginRequest({
                username: loginState.username,
                password: loginState.password,
            });

            //response가 에러를 담은 객체라면
            if(isError(response)){
                return thunkAPI.rejectWithValue(getErrorMessage(response));
            }

            // console.log("loginThunk :: response :: "+ JSON.stringify(response, null, 2));

            tokenManager.setToken(response.token);

            // console.log("로그인요청중 :: 베어러 토큰 - "+tokenManager.getToken());

            // console.log(JSON.stringify(response, null, 2));

            return thunkAPI.fulfillWithValue(response);

        } catch (error : unknown) {
            console.log("loginThunk에서 에러");
            console.log(JSON.stringify(error, null, 2));
            console.log(gerServerErrorMessage(error));

            if(isAxiosError(error) && error.response &&!error.response.data) {
                return thunkAPI.rejectWithValue(gerServerErrorMessage(error.response.data));
            }
            return thunkAPI.rejectWithValue(gerServerErrorMessage(error));
        }
})

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            tokenManager.clearToken();
            clearAllCookies();
            const response = await logoutRequest();

            return thunkAPI.fulfillWithValue(response);
        } catch (error: unknown) {
            console.error("로그아웃 실패 :: ", error);

            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data?.message || "알 수 없는 에러");
            }

            return thunkAPI.rejectWithValue("알 수 없는 에러");
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
    loading: false, //이거 언젠가 제거해야 함. isFirstAuthTaskFinished로 바꿨음. Refactoring 필요
    isFirstAuthTaskFinished : ThreeValueBoolean.False,
    //첫 리덕스 처리가 완료 되었는지 아닌지. 처음에 false이고 로그인 중이면 loading 처리 완료되면 무조건 true로 바꿔짐.
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
            state.loading = action.payload.loading;
        },
        setRefresh : (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload.user,
            }
            state.isAuthenticated = action.payload.isAuthenticated;
            // state.isRedirected = action.payload.isRedirected;
            state.isFirstAuthTaskFinished = action.payload.isFirstAuthTaskFinished;
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
            state.loading = action.payload.loading;
            // state.token = action.payload.token;
        },
        setIsFirstAuthTaskFinished : (state, action) => {
            state.isFirstAuthTaskFinished = action.payload;
            state.loading = action.payload.loading;
        },
        setAuthentication : (state , action) => {
            state.isAuthenticated = action.payload;
            state.loading = action.payload.loading;
        },
        setShouldRedirect: (state, action) => {
            state.shouldRedirect = action.payload;
            state.loading = action.payload.loading;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = action.payload.loading;
        }
    },
    //비동기작업
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;//이거 지워야함...
                state.isFirstAuthTaskFinished = ThreeValueBoolean.Loading;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {

                state.isAuthenticated = true;
                state.user = {
                    ...state.user,
                    ...action.payload.data.user
                };
                state.loading = false;
                state.isFirstAuthTaskFinished = ThreeValueBoolean.True;
                // state.token = action.payload.token;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.isFirstAuthTaskFinished = ThreeValueBoolean.True;
                state.isAuthenticated = false;
                state.error = action.payload || `로그인 실패 :: 에러메세지 없음`;
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
                state.isFirstAuthTaskFinished = ThreeValueBoolean.False;
                state.error = action.payload || '로그아웃 실패 :: 에러메세지 없음';
            });
    }
})
export const { setUser, setRefresh, setIsFirstAuthTaskFinished,setUserAndToken, setAuthentication, setShouldRedirect, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;