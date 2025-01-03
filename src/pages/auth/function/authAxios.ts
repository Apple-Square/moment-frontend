import {axiosInstance, axiosInstanceWithAccessToken} from "../../../lib/axiosInstance.ts";
import {LoginRequestDto, LoginResponseDto} from "../../../interface/AxiosInterface.ts";
import {JSONColor} from "../../../lib/deepLog.ts";
import {castError, getErrorMessage, getErrorStatus, setErrorMessage} from "../../../lib/ErrorUtil.ts";
import {AxiosResponse} from "axios";

export interface CheckDto {
    timeStamp: string;
    available: boolean;
    message: string;
}
export interface minimalDto {
    timeStamp: string;
    message: string;
}
export interface kakaoResponseDto {
    timeStamp : string;
    user : {
        id : string,
        nickname : string,
        profileImage : string
    }
    message : string;
}
// export const kakaoLoginRequest = async () => {
//     try {
//         const response = await axiosInstance.get(`/oauth/kakao/login`, {
//             validateStatus: (status) => status === 302 || status < 400,
//         });
//
//         // 카카오 로그인 URL로 리다이렉트
//         const kakaoRedirectUrl = response.headers.location;
//
//         if (kakaoRedirectUrl) {
//             window.location.href = kakaoRedirectUrl; // 브라우저에서 리다이렉트
//         } else {
//             throw new Error("카카오 로그인 URL이 반환되지 않았습니다.");
//         }
//     } catch (error: unknown) {
//         console.error("카카오 로그인 요청 실패:", error);
//         return castError(error);
//     }
// };
export const naverLoginRequest = async () : Promise<void> => {
        const response = await axiosInstance.get(`/oauth/naver/login`, {
            validateStatus: (status) => status === 302 || status < 400,
        });
        // 네이버 로그인 URL로 리다이렉트
        const redirectUrl = response.data;

        if (redirectUrl) {
            window.location.href = redirectUrl; // 브라우저에서 리다이렉트
        } else {
            throw new Error("네이버 로그인 URL이 반환되지 않았습니다.");
        }
}

export const kakaoLoginRequest = async () : Promise<void> => {
        const response = await axiosInstance.get(`/oauth/kakao/login`, {
            validateStatus: (status) => status === 302 || status < 400,
        });
        const redirectUrl = response.data;
        console.log(JSON.stringify("리다이렉트 유알엘", null, 2));
        console.log(JSON.stringify(redirectUrl, null, 2));

        if (redirectUrl) {
            window.location.href = redirectUrl; // 브라우저에서 리다이렉트
        } else {
            throw new Error("카카오 로그인 URL이 반환되지 않았습니다.");
        }
}

// export const kakaoLoginRequest = (): void => {
//     const redirectUri = `${import.meta.env.VITE_APP_BASE_URL}` + '/oauth/kakao/callback';
//     console.log('redirectUri :: ', redirectUri);
//     const encodedUri = encodeURIComponent(redirectUri);
//     window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_APP_KAKAO_CLIENT_ID}&redirect_uri=${encodedUri}`;
// }

export const passwordRecoveryRequest = async (token : string, newPassword : string) : Promise<boolean | Error> => {
    try {
        const response = await axiosInstance.patch(`/auth/password/reset`, {
            token,
            newPassword
        });

        return (response.status === 200);
    } catch (error : unknown) {

        const status = getErrorStatus(error);

        if (status === 410) {
            setErrorMessage(error, "이미 비밀번호를 \n 변경하셨거나 만료되었습니다.");
        }

        return castError(error);

    }
}

export const accountRecoveryRequest = async (email : string):Promise<string | Error> => {
    try {
        const response = await axiosInstance.post(`/auth/account/recovery`,
            email);

        response.data.message = "계정 복구 메일을 전송했습니다.";

        return response.data.message;
    } catch (error : unknown) {

        if(getErrorStatus(error) === 400) {
            setErrorMessage(error,"올바른 형식의 이메일 주소이어야 합니다.");
        }

        return castError(error);
    }
}

// export const kakaoLoginRequest = async () => {
//     try {
//         const response = await axiosInstance.get(`/oauth/kakao/login`, {
//             validateStatus: (status) => status === 302 || status < 400,
//         });
//
//         // 카카오 로그인 URL로 리다이렉트
//         const kakaoRedirectUrl = response.headers.location;
//
//         if (kakaoRedirectUrl) {
//             window.location.href = kakaoRedirectUrl; // 브라우저에서 리다이렉트
//         } else {
//             throw new Error("카카오 로그인 URL이 반환되지 않았습니다.");
//         }
//     } catch (error: unknown) {
//         console.error("카카오 로그인 요청 실패:", error);
//         return castError(error);
//     }
// };


export const signUpRequest = async (nickname, userId, pwd, year, month, day, gender, email, address: string): Promise<boolean | Error> => {
    try {
        console.log("\n",nickname, " ", userId, " ", pwd, " ", year, " ", month, " ", day, " ", gender, " ", email, " ", address);

        const yearValue = year?.value || ""; // 2024
        const monthValue = month?.value.toString().padStart(2, "0") || ""; // 05
        const dayValue = day?.value.toString().padStart(2, "0") || ""; // 27
        const genderValue = gender?.value || ""; // 'MALE'

        console.log("yearValue :: ", yearValue);
        console.log("monthValue :: ", monthValue);
        console.log("dayValue :: ", dayValue);
        console.log("genderValue :: ", genderValue);

        const response = await axiosInstance.post<minimalDto>(`/auth/signup`, {
            nickname: nickname,
            username: userId,
            password: pwd,
            birth: `${yearValue}-${monthValue}-${dayValue}`, // '2024-05-27'
            gender: genderValue,
            email: email,
            address: address,
        });

        return (response.status === 201);
    } catch (error: unknown) {
        const status = getErrorStatus(error);

        console.log(error);
        if (status === 500) {
            setErrorMessage(error, "서버에 문제가 있습니다.");
        }

        return castError(error);
    }
}

export const validateEmailAuthCodeRequest = async (email, authCode : string) : Promise<boolean | Error> => {
    try {
        const response = await axiosInstance.post<minimalDto>(`/auth/email/code/validate`, {
            email : email,
            code : authCode
        });
        return (response.status === 200)
    } catch (error : unknown) {

        const status = getErrorStatus(error);

        if (status === 500) {
            setErrorMessage(error, "서버에 문제가 있습니다.");
        }

        return castError(error);
    }
}

export const sendEmailRequest = async (email : string) : Promise<boolean | Error> => {
    try {
        console.log(JSON.stringify(email, null, 2));
        const response = await axiosInstance.post<minimalDto>(`/auth/email/code`, {
          email
        });
        return (response.status === 200)
    } catch (error : unknown) {
        console.log(`sendEmailRequest 에러: ${JSON.stringify(error, null, 2)}`);
        setErrorMessage(error, "서버에 문제가 생겼습니다.");
        return castError(error);
    }
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
            setErrorMessage(error, getErrorMessage(error)); // 배열을 스트링으로 바꿨음
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
            const errorMessage = getErrorMessage(error);
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