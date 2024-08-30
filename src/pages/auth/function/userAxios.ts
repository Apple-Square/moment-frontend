import {axiosInstance} from "../../../lib/axiosInstance.ts";
import {LoginRequestDto, LoginResponseDto, LogoutRequestDto} from "../../../interface/AxiosInterface.ts";
import {clearAllCookies} from "../../common/function/cookie.ts";
import {JSONColor} from "../../../lib/deepLog.ts";
import {getErrorName, setErrorMessage} from "../../../lib/ErrorUtil.ts";
export const loginRequest = async (loginRequestDto : LoginRequestDto) : Promise<LoginResponseDto | Error> => {
    try {
        console.log("login 요청 :: " + JSONColor.stringify(loginRequestDto,null,2));
        const response = await axiosInstance.post(`/auth/login`, loginRequestDto);
        console.log("login 응답 :: " + JSONColor.stringify(response,null,2));
        return {
            data: response.data,
            token: response.headers['authorization'], // 필요한 정보만 추출
        }
    } catch (error : unknown) {
        console.log(`loginRequest에서 에러 :: ${JSONColor.stringify(error)}`);
        if(getErrorName(error) === "AxiosError"){
            setErrorMessage(error, "네트워크 오류");
        }
        return error as Error;
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
        console.log("logout 요청 :: " + JSONColor.stringify(logoutRequestDto));
        const response = await axiosInstance.post(`/auth/logout`, logoutRequestDto);
        console.log("logout 응답 :: " + JSONColor.stringify(response));
        clearAllCookies();
        return response;
    } catch (error) {
        console.log("로그아웃 요청 에러 :: " + error);
    }

}
//아직 API가 제작이 안되었음