import {useAppDispatch, useAppSelector} from "./redux/store/hooks.ts";
import {useEffect} from "react";
import {refreshRequest} from "./pages/auth/function/authAxios.ts";
import {getMeRequest} from "./pages/user/function/userAxiosRequest.tsx";
import {setUserAndToken} from "./redux/slices/authSlice.ts";
import {merge} from "chart.js/helpers";
import {AxiosError, AxiosResponse} from "axios";
import {tokenManager} from "./lib/axiosInstance.ts";

/**
 * 얘는 리로드했을 때 즉, AccessToken이 만료되었을때 즉시 RefreshToken으로부터 AccessToken을 받아오는 역할을 한다.
 *
 * @param children
 * @constructor
 */
export const AuthLoader = ({children}) => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            console.log("AuthLoader :: 1");
            console.log(JSON.stringify(auth, null, 2));
            if (!auth.isAuthenticated && !auth.token && !auth.loading) {
                console.log("AuthLoader :: 2");
                const response = await refreshRequest();
                console.log(JSON.stringify(response, null, 2));

                if (response?.status === 200 && response?.headers?.authorization) {

                    console.log(response.headers.authorization);
                    tokenManager.setToken(response.headers.authorization);
                    // getMeRequest 호출
                    console.log(tokenManager.getToken());
                    const userResponse = await getMeRequest();
                    console.log(JSON.stringify(userResponse, null, 2));

                    // 에러 객체 처리
                    if (userResponse instanceof Error) {
                        // 에러를 발생시킨 것이 AxiosError인 경우
                        if (userResponse instanceof AxiosError) {
                            console.error("AuthLoader :: AxiosError 발생:", userResponse.response);
                        } else {
                            console.error("AuthLoader :: Error 발생:", userResponse.message);
                        }
                        return; // 에러 발생 시 실행 중단
                    }

                    // userResponse가 AxiosResponse인지 확인
                    if ((userResponse as AxiosResponse).data?.user) {
                        dispatch(setUserAndToken({
                            user: (userResponse as AxiosResponse).data.user,
                            token: response.headers.authorization,
                            isAuthenticated : true,
                            isRedirected : true,
                            loading : false,
                            error : null,
                        }));
                    } else {
                        console.error("AuthLoader :: 유효하지 않은 사용자 데이터:", userResponse);
                    }
                }
            }
        };

        fetchData();
    }, [dispatch, auth]);
    //서버로 부터

    useEffect(() => {

        console.log("AuthLoader :: "+JSON.stringify(auth, null, 2));
    },[auth]);

    return <>{children}</>
};