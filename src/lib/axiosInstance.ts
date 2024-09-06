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
 * 인터셉터는 response가 왔을 때 작동한다.
 * 403에러가 왔다면 리프레시 토큰을 요청하고, 리프레시 토큰을 성공적으로 받았다면 원래 요청을 다시 보낸다.
 * 언제 403에러가 오느냐. 요청 도중에 액세스 토큰이 만료될 경우에 올 것이다. 그 상황에 대처한다.
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
                    }, 60); // 0.06초

                    return axiosInstance.request(originalRequestConfig);

                } catch (err) {
                    // window.location.href = `/auth/authMain`;
                    refreshingAvailable = true;
                    //원래 요청이 실패했음을 호출한 곳으로 전달
                    return Promise.reject(error);
                }
            }
        }
        return Promise.reject(error);
    }
)