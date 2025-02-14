import axios from "axios";
import {JSONColor, objectDeepDigger, objectDigger} from "./deepLog.ts";


/**
 * IIFE(Immediately Invoked Function Expression를 이용한 싱글톤 패턴
 * 싱글톤 패턴을 이용하지 않으면 매번 새로운 인스턴스가 생성되고 토큰을 관리할 수 없게 된다.
 */

export const tokenManager = (() => {
    let accessToken = ''; // 이 변수는 외부에서 접근 불가능
    return {
        getToken: function() {
            return accessToken;
        },
        setToken: function(newToken) {
            accessToken = newToken;
        },
        clearToken: function () {
            accessToken = '';
        }
    };
})();
/**
 * token 없는 user가 사용
 * withCredentials : true
 * timeout : 10000
 * headers : 'Content-Type': 'application/json'
 */

const TIME_OUT_VALUE = 100000;

export const axiosInstance = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : TIME_OUT_VALUE,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * axios.create()는 처음 호출될때 인스턴스를 생성하므로,
 * create함수의 인자에 Authorization을 설정해봐야 동적으로 토큰을 설정할 수 없다.
 * 즉, 직접 header : {'Content-Type': 'application/json'}을 설정하더라도 동적으로 토큰을 설정할 수 없다.
 * 그래서 인터셉터를 사용하여 토큰을 동적으로 설정한다.
 * 
 * token 있는 user가 사용
 * - token 있을 때 axiosInstance 사용하면 error, 반드시 axiosInstanceWithAccessToken 사용
 */
export const axiosInstanceWithAccessToken = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : TIME_OUT_VALUE,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const axiosInstanceWithFormData = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : TIME_OUT_VALUE,
});

export const axiosInstanceWithFormDataAndToken = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : TIME_OUT_VALUE,
});

/**
 * Axios 인터셉터: 요청을 보내기 전에 Access Token을 Authorization 헤더에 추가
 * 일반적인 JSON 데이터 전송에 사용
 */
axiosInstanceWithAccessToken.interceptors.request.use(
    function (config) {
        const token = tokenManager.getToken();
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
)
/**
 * Axios 인터셉터: 요청을 보내기 전에 Access Token을 Authorization 헤더에 추가
 * 사용 예: FormData를 포함한 요청에 사용
 */
axiosInstanceWithFormDataAndToken.interceptors.request.use(
    function (config) {
        const token = tokenManager.getToken();
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
)
/**
 * Axios 인터셉터: 응답 처리 로직을 설정
 * - 2xx 응답: 서버에서 성공 응답을 받은 경우, 추가 작업 없이 그대로 반환
 * - 401 응답: 인증 오류 발생 시, Refresh Token을 사용하여 토큰을 갱신하고 요청을 재시도
 *    - 무한 재시도를 방지하기 위해 `refreshingAvailable` 변수를 사용
 *    - Refresh 요청 실패 시, 원래 에러를 호출자에게 전달
 * - 기타 에러: 에러를 그대로 호출자에게 전달
 *
 * @param {AxiosInstance} instance - Axios 인스턴스에 인터셉터를 설정
 */
const setUpResponseInterceptor = (instance) => {
    let isRefreshing = false;  // Refresh 진행 여부
    let refreshTokenPromise: Promise<void> | null = null;

    instance.interceptors.response.use(
        response => response,  // 성공 응답은 그대로 반환

        async error => {
            const originalRequest = error.config;

            // 헤더에 있는 'X-Skip-Interceptor'로 예외 처리
            if (originalRequest.headers['X-Skip-Interceptor'] === 'true') {
                return Promise.reject(error);
            }

            // 401 에러 발생 && 중복 재시도 방지 플래그 설정
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;  // 중복 재시도 방지

                // Refresh 중이 아니면, Refresh 요청 시작
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshTokenPromise = axios.post(`${import.meta.env.VITE_APP_BASE_URL}/auth/refresh`, {}, {
                        withCredentials: true
                    })
                        .then((response) => {
                            const newAccessToken = response.headers['authorization'];
                            if (newAccessToken) {
                                tokenManager.setToken(newAccessToken);
                            } else {
                                console.error("새로운 토큰을 받아오지 못했습니다.");
                                return Promise.reject(new Error("토큰 없음"));
                            }

                            isRefreshing = false;  // Refresh 완료
                            console.log("리프레시 완료@@@@@@@@@@@@");
                            refreshTokenPromise = null;
                        })
                        .catch(err => {
                            isRefreshing = false;  // 실패 시 상태 복구
                            refreshTokenPromise = null;

                            // 로그인 페이지 이동 또는 로그아웃 처리
                            return Promise.reject(err);
                        });
                }

                // Refresh가 끝날 때까지 대기 후 실패한 요청 재시도
                return refreshTokenPromise!.then(() => {
                    console.log("재요청 시도 했습니다.");
                    // console.log("재요청 Authorization 헤더:", axios.defaults.headers.common['Authorization']);
                    originalRequest.headers['Authorization'] = `Bearer ${axios.defaults.headers.common['Authorization']}`;
                    return instance(originalRequest);  // 토큰 갱신 후 원래 요청 재시도
                });
            }

            // 401이 아닌 에러는 그대로 반환
            return Promise.reject(error);
        }
    );
};

// 각 인스턴스에 공통 인터셉터 적용
[axiosInstance, axiosInstanceWithAccessToken, axiosInstanceWithFormData, axiosInstanceWithFormDataAndToken].forEach(setUpResponseInterceptor);