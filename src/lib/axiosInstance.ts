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
export const axiosInstance = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : 100000,
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
    timeout : 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const axiosInstanceWithFormData = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : 10000,
});

export const axiosInstanceWithFormDataAndToken = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : 10000,
});

let refreshingAvailable : boolean = true;

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
    instance.interceptors.response.use(
        function (response) {
            // 성공적인 응답은 그대로 반환
            console.log("서버로부터 2xx번호의 응답이 왔습니다\n인터셉터 작동할 것이 없습니다. - response :: ");
            console.log(JSON.stringify(response, null, 2));
            return response;
        }, async function (error) {
            if (error.response && error.response.status === 401) {
                // 401 에러 발생: 인증 실패
                console.log(JSONColor.stringify(`서버로부터 401번호의 응답이 왔습니다\n인터셉터 작동 - error :: ${error}\n`));
                console.log(JSONColor.stringify(`에러 리스폰스  :: ` + error.response));

                // 무한 재시도를 방지하기 위해 `refreshingAvailable` 변수 사용
                if (refreshingAvailable) {
                    refreshingAvailable = false; // Refresh 요청 중 다른 요청이 중복되지 않도록 설정
                    try {
                        // Refresh Token 요청
                        await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/auth/refresh`, {}, {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            withCredentials: true
                        });

                        const originalRequestConfig = error.config; // 실패했던 요청을 저장

                        // 일정 시간 후 다시 Refresh 요청 가능하도록 설정
                        setTimeout(() => {
                            refreshingAvailable = true;
                        }, 60); // 0.06초

                        // 실패했던 요청을 한 번 재시도
                        return instance.request(originalRequestConfig);
                    } catch (err) {
                        // Refresh 요청 실패 시 다시 요청하지 않고 원래 에러 반환
                        refreshingAvailable = true; // Refresh 가능 상태 복원
                        return Promise.reject(error); // 원래 에러를 호출자에게 전달
                    }
                }
            }
            // 401이 아닌 에러는 그대로 호출자에게 전달
            return Promise.reject(error);
        }
    );
};

// 각 인스턴스에 공통 인터셉터 적용
[axiosInstance, axiosInstanceWithAccessToken, axiosInstanceWithFormData, axiosInstanceWithFormDataAndToken].forEach(setUpResponseInterceptor);