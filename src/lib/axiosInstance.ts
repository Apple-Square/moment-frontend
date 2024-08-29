import axios from "axios";
import {JSONColor, objectDeepDigger, objectDigger} from "./deepLog.ts";



const axiosInstance = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    timeout : 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

let refreshingAvailable : boolean = true;

/**
 * 엔드포인트가 403에러만 내보낼 시 인터셉터가 순환오류에 빠지기 때문에 0.1초 뒤에 리프레시 요청 권한을 부여한다.
 *
 */
axiosInstance.interceptors.response.use(
    function(response) {
        console.log(JSON.stringify(`서버로부터 2xx번호의 응답이 왔습니다\n인터셉터 작동 - response :: ${response}\n`,null,2));
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


const axiosTestInstance = axios.create({
    withCredentials: true,
    timeout : 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

let refreshingAvailableForTest : boolean = true;

axiosTestInstance.interceptors.response.use(
    function(response) {
        console.log(JSONColor.stringify(`서버로부터 2xx번호의 응답이 왔습니다\n인터셉터 작동 - response :: ${response}\n`));
        return response;
    }, async function (error) {
        if (error.response && error.response.status === 403){
            // console.log(`에러 리스폰스 ${JSONCOLOR.stringify(error.response, null, 2)}`);
            // console.log(Object.keys(error));
            // console.log(Object.getOwnPropertyNames(error));
            // console.log(Object.getOwnPropertyDescriptor(error, 'status'));
            // for (const key in error) {
            //     console.log(key);
            // }
            console.log(`error :: ${Object.getOwnPropertyNames(error)}`);
        console.log(`서버로부터 403번호의 응답이 왔습니다\n인터셉터 작동 - error :: ${JSON.stringify(error,null,2)}\n`, { depth: null });
            if (refreshingAvailableForTest) {
            refreshingAvailableForTest = false;
            try {
                const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/auth/refresh`,{}, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials : true
                });
                console.log(`response :: ${objectDigger(response)}`)
                const originalRequestConfig = error.config;

                setTimeout(() => {
                    refreshingAvailableForTest = true;
                }, 100); // 0.1초

                return axiosTestInstance.request(originalRequestConfig);

            } catch (err) {
                // window.location.href = `/auth/authMain`;
                refreshingAvailableForTest = true;
                return Promise.reject(error);
            }
        }
    }
        return Promise.reject(error);
    }
)

export {axiosInstance, axiosTestInstance};