import axios from "axios";
import {JSONColor, objectDeepDigger, objectDigger} from "./deepLog.ts";

export const tokenManager = () => {
    let accessToken = ''; // 이 변수는 외부에서 접근 불가능
    return {
        getToken: function() {
            return accessToken;
        },
        setToken: function(newToken) {
            accessToken = newToken;
        }
    };
}
/**
 * withCredentials : true
 * timeout : 10000
 * headers : 'Content-Type': 'application/json'
 */
export const axiosInstance = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const axiosInstanceWithAccessToken = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : 10000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokenManager().getToken(),
    },
});

/**
 *
 */
export const axiosInstanceWithFormData = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : 10000,
    headers: {
        'Content-Type': 'multipart/form-data'
    },
});

export const axiosInstanceWithFormDataAndToken = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : 10000,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + tokenManager().getToken(),
    },
});

let refreshingAvailable : boolean = true;

/**
 * 엔드포인트가 403에러만 내보낼 시 refreshingAvailable을 즉시 true로 만들면, 순환오류에 빠진다.
 * 그러므로 0.1초 뒤에 리프레시 요청 권한을 부여한다.
 *
 */
axiosInstance.interceptors.response.use(
    function(response) {
        console.log("서버로부터 2xx번호의 응답이 왔습니다\n인터셉터 작동할 것이 없습니다. - response :: ");
        console.log(JSON.stringify(response,null,2));
        return response;
    }, async function (error) {
        if (error.response && error.response.status === 403){
        console.log(JSONColor.stringify(`서버로부터 403번호의 응답이 왔습니다\n인터셉터 작동 - error :: ${error}\n`));
            console.log(JSONColor.stringify(`에러 리스폰스  :: ` + error.response));
            if (refreshingAvailable) {
                refreshingAvailable = false;
                try {
                    await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/auth/refresh`,{}, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials : true
                    });
                    const originalRequestConfig = error.config;

                    setTimeout(() => {
                        refreshingAvailable = true;
                    }, 100); // 0.1초

                    return axiosInstance.request(originalRequestConfig);

                } catch (err) {
                    // window.location.href = `/auth/authMain`;
                    refreshingAvailable = true;
                    return Promise.reject(error);
                }
            }
        }
        return Promise.reject(error);
    }
)