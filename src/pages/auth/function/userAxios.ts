import axiosInstance from "../../../lib/axiosInstance.ts";
import {LoginRequestDto, LogoutRequestDto} from "../interface/AxiosInterface.ts";
import {clearAllCookies} from "../../common/function/cookie.ts";
export const loginRequest = async (loginRequestDto : LoginRequestDto) => {
    try {
        console.log("login 요청 :: " + JSON.stringify(loginRequestDto,null,2));
        const response = await axiosInstance.post(`/api/auth/login`, loginRequestDto);
        console.log("login 응답 :: " + JSON.stringify(response,null,2));
        return {
            data: response.data,
            token: response.headers['authorization'], // 필요한 정보만 추출
        }
    } catch (error) {
        console.log("login 요청 에러 :: "+ JSON.stringify(error));
    }
}
/*
        {
            "timeStamp": "2024-08-22 12:47:57.501",
            "message": "로그인에 성공했습니다.",
            "user": {
                "id": "v3qqO9x7bOnCdQP",
                "nickname": "D-VA",
                "profileImage": "http://localhost:8080/api/files/default-profile.png"
            }
        }
*/
export const logoutRequest = async (logoutRequestDto : LogoutRequestDto) => {
    try{
        console.log("logout 요청 :: " + logoutRequestDto);
        const response = await axiosInstance.post(`/api/auth/logout`, logoutRequestDto);
        console.log("logout 응답 :: " + response);
        clearAllCookies();
        return response;
    } catch (error) {
        console.log("로그아웃 요청 에러 :: " + error);
    }

}
//아직 API가 제작이 안되었음