import {axiosInstance, axiosInstanceWithAccessToken} from "../../../lib/axiosInstance.ts";
import {LoginRequestDto, LoginResponseDto} from "../../../interface/AxiosInterface.ts";
import {clearAllCookies} from "../../common/function/cookie.ts";
import {JSONColor} from "../../../lib/deepLog.ts";
import {castError, getErrorName, setErrorMessage} from "../../../lib/ErrorUtil.ts";
import {AxiosResponse} from "axios";
export const loginRequest = async (loginRequestDto : LoginRequestDto) : Promise<LoginResponseDto | Error> => {
    try {
        // console.log("login 요청 :: " + JSONColor.stringify(loginRequestDto,null,2));
        const response = await axiosInstance.post(`/auth/login`, loginRequestDto);
        // console.log("login 응답 :: " + JSONColor.stringify(response,null,2));
        return {
            data: response.data,
            token: response.headers['authorization'], // 필요한 정보만 추출
        }
    } catch (error : unknown) {
        // console.log(`디티오 `+JSON.stringify(loginRequestDto, null, 2));
        // console.log(`loginRequest에서 에러 :: ${JSONColor.stringify(error)}`);
        // if(getErrorState(error) === "401"){
        //     setErrorMessage(error, "아이디와 비밀번호를 확인해주세요.");
        // }
        if(getErrorName(error) === "AxiosError"){
            setErrorMessage(error, "네트워크 오류");
        }
        return castError(error);
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
export const logoutRequest = async () : Promise<AxiosResponse<any, any> | undefined> => {
    try{
        const response = await axiosInstanceWithAccessToken.post(`/auth/logout`);
        // console.log("logout 응답 :: " + JSONColor.stringify(response));
        clearAllCookies();
        return response;
    } catch (error) {
        console.log("로그아웃 요청 에러 :: " + error);
        throw castError(error)
    }
}

//아직 API가 제작이 안되었음
export const refreshRequest = async () : Promise<AxiosResponse<any, any> | undefined> => {
    try {
        const response = await axiosInstance.post("/auth/refresh");
        // console.log("refresh 응답 :: " + JSONColor.stringify(response));
        return response;
    } catch (error) {
        console.log("refresh 요청 에러 :: " + error);
        throw castError(error)
    }
}