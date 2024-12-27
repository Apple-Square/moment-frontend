import {axiosInstance, axiosInstanceWithAccessToken} from "../../../lib/axiosInstance.ts";
import {LoginRequestDto, LoginResponseDto} from "../../../interface/AxiosInterface.ts";
import {clearAllCookies} from "../../common/function/cookie.ts";
import {JSONColor} from "../../../lib/deepLog.ts";
import {castError, getErrorStatus, setErrorMessage} from "../../../lib/ErrorUtil.ts";
import {AxiosResponse} from "axios";

export interface CheckDto {
    timeStamp: string;
    available: boolean;
    message: string;
}

export const checkUserIdRequest = async (username: string): Promise<CheckDto | Error> => {
    try {
        const response = await axiosInstance.get<CheckDto>(`/auth/username/validation`, {
            params: { username },
        });
        console.log("checkUserIdRequest 응답:", response.data);
        return response.data;
    } catch (error: unknown) {
        // 에러 상태 확인 및 메시지 설정
        console.log(`checkUserIdRequest 에러: ${JSON.stringify(error, null, 2)}`);

        const status = getErrorStatus(error);

        // 상태 코드에 따른 에러 메시지 설정
        if (status === 400) {
            const errorMessage = extractBadRequestMessage(error);
            setErrorMessage(error, errorMessage);
        } else if (status === 409) {
            setErrorMessage(error, "이미 존재하는 아이디입니다.");
        } else {
            setErrorMessage(error, "중복 검사 중 오류가 발생했습니다.");
        }

        return castError(error);
    }
};

export const checkEmailRequest = async (email: string) : Promise<CheckDto | Error> => {
    try {
        const response = await axiosInstance.get<CheckDto>(`/auth/email/validation`, {
            params : {email},
        });
        console.log("checkUserIdRequest 응답 : ", response.data);
        return response.data;
    } catch (error : unknown) {
        console.log(`checkUserIdRequest 에러 : ${JSON.stringify(error, null, 2)}`);

        const status = getErrorStatus(error);

        // 상태 코드에 따른 에러 메시지 설정
        if (status === 400) {
            setErrorMessage(error, "잘못된 요청 형식입니다. 이메일을 확인하세요.");
        } else if (status === 409) {
            setErrorMessage(error, "이미 사용 중인 이메일입니다.");
        } else {
            setErrorMessage(error, "중복 검사 중 오류가 발생했습니다.");
        }

        return castError(error);
    }
}

export const checkNicknameRequest = async (nickname: string): Promise<CheckDto | Error> => {
    try {
        // GET 요청 수행

        console.log("들어가있는 값 :: " + JSON.stringify(nickname, null, 2));

        const response = await axiosInstance.get<CheckDto>(`/auth/nickname/validation`, {
            params: { nickname },
        });

        console.log("checkNicknameRequest 응답:", response.data);
        return response.data; // 성공 시 CheckDto 반환
    } catch (error: unknown) {
        console.log(`checkNicknameRequest 에러 : ${JSON.stringify(error, null, 2)}`);

        const status = getErrorStatus(error);

        // 상태 코드에 따른 에러 메시지 설정
        if (status === 400) {
            const errorMessage = extractBadRequestMessage(error);
            setErrorMessage(error, errorMessage);
        } else if (status === 409) {
            setErrorMessage(error, "이미 존재하는 닉네임입니다.");
        } else {
            setErrorMessage(error, "닉네임 중복 검사 중 오류가 발생했습니다.");
        }

        return castError(error); // 에러 객체 반환
    }
};

const extractBadRequestMessage = (error: any): string => {
    try {
        const responseData = error.response?.data;
        if (Array.isArray(responseData.message)) {
            return responseData.message.join(", ");
        } else if (typeof responseData.message === "string") {
            return responseData.message;
        }
    } catch (e) {
        console.error("BadRequest 메시지 추출 실패:", e);
    }
    return "잘못된 요청입니다. 입력값을 확인해주세요.";
};

export const loginRequest = async (loginRequestDto : LoginRequestDto) : Promise<LoginResponseDto | Error> => {
    try {
        // console.log("login 요청 :: " + JSONColor.stringify(loginRequestDto,null,2));
        const response = await axiosInstance.post(`/auth/login`, loginRequestDto);
        console.log("authAxios :: login 응답 :: " + JSONColor.stringify(response,null,2));

        return {
            data: response.data,
            token: response.headers['authorization'], // 필요한 정보만 추출
        }
    } catch (error : unknown) {
        // console.log(`디티오 `+JSON.stringify(loginRequestDto, null, 2));
        console.log(`loginRequest에서 에러 :: ${JSONColor.stringify(error)}`);
        // if(getErrorState(error) === "401"){
        //     setErrorMessage(error, "아이디와 비밀번호를 확인해주세요.");
        // }
        if(getErrorStatus(error) === 401){
            setErrorMessage(error, "아이디 또는 비밀번호 오류");
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
        return response;
    } catch (error) {
        console.log("로그아웃 요청 에러 :: " + error);
        throw castError(error)
    }
}

export const refreshRequest = async () : Promise<AxiosResponse<any, any> | undefined> => {
    try {
        const response = await axiosInstance.post("/auth/refresh");
        console.log("refresh 응답 :: " + JSONColor.stringify(response));
        return response;
    } catch (error) {
        console.log("refresh 요청 에러 :: " + error);
        throw castError(error)
    }
}