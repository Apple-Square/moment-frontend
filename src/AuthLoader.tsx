import {useAppDispatch, useAppSelector} from "./redux/store/hooks.ts";
import {useEffect, useState} from "react";
import {refreshRequest} from "./pages/auth/function/authAxios.ts";
import {getMeRequest} from "./pages/user/function/userAxiosRequest.tsx";
import {setRefresh, setIsFirstAuthTaskFinished, setAuthentication} from "./redux/slices/authSlice.ts";
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
    const [token, setToken] = useState(tokenManager.getToken());

    useEffect(() => {
        // refresh 작업이 이미 완료되었다면 더 이상 호출하지 않음
        if (auth.isFirstAuthTaskFinished === ThreeValueBoolean.True) {
            return;
        }

        // refresh 작업 중이면 중복 호출 방지
        if (auth.isAuthenticated && token && auth.loading) {
            return;
        }

        const fetchData = async () => {
            const response = await refreshRequest();
            if (response instanceof Error) {
                console.error("토큰 갱신 실패:", response.message);
                dispatch(setIsFirstAuthTaskFinished(ThreeValueBoolean.True));
                dispatch(setAuthentication(false));
            } else if (response?.status === 200 && response?.headers?.authorization) {
                console.log("인증 토큰을 성공적으로 받았습니다.");
                tokenManager.setToken(response.headers.authorization);

                const userResponse = await getMeRequest();
                if (userResponse instanceof Error) {
                    if (userResponse instanceof AxiosError) {
                        console.error("AuthLoader :: AxiosError 발생:", userResponse.response);
                    } else {
                        console.error("AuthLoader :: Error 발생:", userResponse.message);
                    }
                    return;
                }

                if ((userResponse as AxiosResponse).data?.user) {
                    console.log("사용자 데이터를 성공적으로 가져왔습니다.");
                    showToast("success", "로그인 되었습니다. 테스트용", 1000);
                    dispatch(setRefresh({
                        user: (userResponse as AxiosResponse).data.user,
                        isAuthenticated: true,
                        isFirstAuthTaskFinished: ThreeValueBoolean.True,
                        loading: true,
                        error: null,
                    }));
                } else {
                    console.error("AuthLoader :: 유효하지 않은 사용자 데이터");
                }
            } else {
                console.log("인증 토큰 갱신에 실패했습니다.");
                dispatch(setIsFirstAuthTaskFinished(ThreeValueBoolean.True));
                dispatch(setAuthentication(false));
            }
        };

        fetchData();
    }, [dispatch, auth.isAuthenticated, token]);

    if (auth?.isFirstAuthTaskFinished === ThreeValueBoolean.False) {
        return null;
    }
    return <>{children}</>
};