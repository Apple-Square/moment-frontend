import axiosInstance from "../../../lib/axiosInstance.ts";
import {LoginRequestDto, LogoutRequestDto} from "../interface/AxiosInterface.ts";
import {clearAllCookies} from "../../common/function/cookie.ts";
export const login = async (loginRequestDto : LoginRequestDto) => {
    try {
        console.log("login 요청 :: " + loginRequestDto);
        const response = await axiosInstance.post(`/api/auth/login`, loginRequestDto);
        console.log("login 응답 :: " + response);
        return response;
    } catch (error) {
        console.log("login 요청 에러 :: "+ error);
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
export const logout = async (logoutRequestDto : LogoutRequestDto) => {
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