import {useAppDispatch, useAppSelector} from "./redux/store/hooks.ts";
import {useEffect, useState} from "react";
import {refreshRequest} from "./pages/auth/function/authAxios.ts";
import {getMeRequest} from "./pages/user/function/userAxiosRequest.tsx";
import {setRefresh, setIsFirstAuthTaskFinished, setAuthentication} from "./redux/slices/authSlice.ts";
import {merge} from "chart.js/helpers";
import {AxiosError, AxiosResponse} from "axios";
import {tokenManager} from "./lib/axiosInstance.ts";
import {showToast} from "./lib/ToastNotification.ts";
import {ThreeValueBoolean} from "./interface/OtherInterface.ts";

/**
 * 얘는 리로드했을 때 즉, AccessToken이 만료되었을때 즉시 RefreshToken으로부터 AccessToken을 받아오는 역할을 한다.
 *
 * @param children
 * @constructor
 */
export const AuthLoader = ({children}) => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);
    const [token,setToken] = useState(tokenManager.getToken());

    useEffect(() => {

        console.log("확인 : auth.isAuthenticated :: " + auth.isAuthenticated + " //token :: " + token + "//auth.loading :: " + auth.loading);
        //있으면 하지마. 셋다 있으면 하지마.
        if (auth.isAuthenticated && token && !auth.loading) {
            console.log("머지");
            return;
        }
        console.log("뭐임;;;");

        //없으면 해
        const fetchData = async () => {
            // console.log(JSON.stringify(auth, null, 2));
            const response = await refreshRequest();
            // console.log(JSON.stringify(response, null, 2));
            if (response instanceof Error) {
                console.error(response.message);
                dispatch(setIsFirstAuthTaskFinished(ThreeValueBoolean.True));
                dispatch(setAuthentication(false));
            }
            else if (response?.status === 200 && response?.headers?.authorization) {

                console.log(response.headers.authorization);
                tokenManager.setToken(response.headers.authorization);
                // getMeRequest 호출
                // console.log(tokenManager.getToken());
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
                    showToast("success","로그인 되었습니다. 테스트용", 1000);
                    dispatch(setRefresh({
                        user: (userResponse as AxiosResponse).data.user,
                        // token: response.headers.authorization,
                        isAuthenticated : true,
                        isFirstAuthTaskFinished : ThreeValueBoolean.True,
                        // isRedirected : true,
                        // loading : false,
                        loading : true,
                        error : null,
                    }));
                } else {
                    console.error("AuthLoader :: 유효하지 않은 사용자 데이터:", userResponse);
                }
            } else {
                console.log("refresh 권한이 없음");
                dispatch(setIsFirstAuthTaskFinished(ThreeValueBoolean.True));
                dispatch(setAuthentication(false));
            }
        };

        fetchData();
    }, [dispatch, auth.isAuthenticated, token]);

    // useEffect(() => {
        // console.log("AuthLoader :: "+JSON.stringify(auth, null, 2));
    // },[auth]);

    if (auth?.isFirstAuthTaskFinished === ThreeValueBoolean.False) {
        // 인증 상태 확인 중 로딩 화면
        return null;
    }
    return <>{children}</>
};