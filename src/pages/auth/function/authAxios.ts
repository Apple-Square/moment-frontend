import {axiosInstance, axiosInstanceWithAccessToken} from "../../../lib/axiosInstance.ts";
import {LoginRequestDto, LoginResponseDto} from "../../../interface/AxiosInterface.ts";
import {JSONColor} from "../../../lib/deepLog.ts";
import {
    castError,
    gerServerErrorMessage,
    getErrorMessage,
    getErrorStatus,
    setErrorMessage
} from "../../../lib/ErrorUtil.ts";
import {AxiosResponse} from "axios";
import axios, { AxiosError } from "axios";

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
    try {
        const response = await axiosInstance.get(`/oauth/naver/login`, {
            validateStatus: (status) => status === 302 || status < 400,
        });
        const redirectUrl = response.data;

        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            throw new Error("네이버 로그인 URL이 반환되지 않았습니다.");
        }
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error("네이버 로그인 요청 실패:", error.response?.data?.message);
        }
    }
}

export const kakaoLoginRequest = async () : Promise<void> => {
    try {
        const response = await axiosInstance.get(`/oauth/kakao/login`, {
            validateStatus: (status) => status === 302 || status < 400,
        });
        const redirectUrl = response.data;

        console.log("리다이렉트 URL:", redirectUrl);

        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            throw new Error("카카오 로그인 URL이 반환되지 않았습니다.");
        }
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error("카카오 로그인 요청 실패:", error.response?.data?.message);
        }
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
            if (error instanceof AxiosError) {
                console.log("에러 메시지:", error.response?.data?.message);
            }
            setErrorMessage(error, "이미 비밀번호를 \n 변경하셨거나 만료되었습니다.");
        }

        return castError(error);
    }
}

export const accountRecoveryRequest = async (email : string):Promise<string | Error> => {
    try {
        const response = await axiosInstance.post(`/auth/account/recovery`, email);

        console.log("응답 메시지:", response.data.message);

        return response.data.message;
    } catch (error : unknown) {
        if (getErrorStatus(error) === 400) {
            setErrorMessage(error,"올바른 형식의 이메일 주소이어야 합니다.");
        }

        if (error instanceof AxiosError) {
            console.error("계정 복구 요청 실패:", error.response?.data?.message);
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
        const yearValue = year?.value ?? undefined;
        const monthValue = month?.value ? month.value.toString().padStart(2, "0") : undefined;
        const dayValue = day?.value ? day.value.toString().padStart(2, "0") : undefined;
        const birthValue = (yearValue && monthValue && dayValue) ? `${yearValue}-${monthValue}-${dayValue}` : undefined;
        const genderValue = gender?.value ?? undefined;
        const requestData: any = {
            nickname: nickname,
            username: userId,
            password: pwd,
            email: email,
        };

        if (birthValue) {
            requestData.birth = birthValue;
        }
        if (genderValue) {
            requestData.gender = genderValue;
        }
        if (address) {
            requestData.address = address;
        }

        const response = await axiosInstance.post<minimalDto>(`/auth/signup`, requestData);

        console.log("응답 메시지:", response.data.message);

        return (response.status === 201);
    } catch (error: unknown) {
        const status = getErrorStatus(error);

        if (axios.isAxiosError(error)) {
            console.error("회원가입 요청 실패:", error.response?.data?.message);
        }
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

        console.log("응답 메시지:", response.data.message);

        return (response.status === 200);
    } catch (error : unknown) {
        const status = getErrorStatus(error);

        if (error instanceof AxiosError) {
            console.error("이메일 인증 코드 검증 요청 실패:", error.response?.data?.message);
        }
        if (status === 500) {
            setErrorMessage(error, "서버에 문제가 있습니다.");
        }

        return castError(error);
    }
}

export const sendEmailRequest = async (email : string) : Promise<boolean | Error> => {
    try {
        const response = await axiosInstance.post<minimalDto>(`/auth/email/code`, { email });

        console.log("응답 메시지:", response.data.message);

        return (response.status === 200);
    } catch (error : unknown) {
        if (error instanceof AxiosError) {
            console.error("이메일 전송 요청 실패:", error.response?.data?.message);
        }
        setErrorMessage(error, "서버에 문제가 생겼습니다.");
        return castError(error);
    }
}

export const checkUserIdRequest = async (username: string): Promise<CheckDto | Error> => {
    try {
        const response = await axiosInstance.get<CheckDto>(`/auth/username/validation`, {
            params: { username },
        });

        console.log("응답 메시지:", response.data.message);

        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error("아이디 중복 검사 요청 실패:", error.response?.data?.message);
        }

        const status = getErrorStatus(error);

        if (status === 400) {
            setErrorMessage(error, gerServerErrorMessage(error));
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

        console.log("응답 메시지:", response.data.message);

        return response.data;
    } catch (error : unknown) {
        if (error instanceof AxiosError) {
            console.error("이메일 중복 검사 요청 실패:", error.response?.data?.message);
        }

        const status = getErrorStatus(error);

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
        const response = await axiosInstance.get<CheckDto>(`/auth/nickname/validation`, {
            params: { nickname },
        });

        console.log("응답 메시지:", response.data.message);

        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error("닉네임 중복 검사 요청 실패:", error.response?.data?.message);
        }

        const status = getErrorStatus(error);

        if (status === 400) {
            const errorMessage = gerServerErrorMessage(error);
            setErrorMessage(error, errorMessage);
        } else if (status === 409) {
            setErrorMessage(error, "이미 존재하는 닉네임입니다.");
        } else {
            setErrorMessage(error, "닉네임 중복 검사 중 오류가 발생했습니다.");
        }

        return castError(error);
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
        const response = await axiosInstance.post(`/auth/login`, loginRequestDto);

        console.log("응답 메시지:", response.data.message);

        return {
            data: response.data,
            token: response.headers['authorization'],
        }
    } catch (error : unknown) {
        if (error instanceof AxiosError) {
            console.error("로그인 요청 실패:", error.response?.data?.message);
        }
        if(getErrorStatus(error) === 401){
            setErrorMessage(error, "아이디 또는 비밀번호 오류");
        } else {
            setErrorMessage(error, "네트워크 에러");
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
export const logoutRequest = async () : Promise<AxiosResponse<any, any> | Error> => {
    try{
        const response = await axiosInstanceWithAccessToken.post(`/auth/logout`);

        console.log("응답 메시지:", response.data.message);

        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("로그아웃 요청 실패:", error.response?.data?.message);
        }
        return castError(error)
    }
}

export const refreshRequest = async () : Promise<AxiosResponse<any, any> | Error> => {
    try {
        const response = await axiosInstance.post("/auth/refresh",{}, {
            headers: {
                'X-Skip-Interceptor': 'true'
            }
        });

        console.log("응답 메시지:", response.data.message);

        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("토큰 갱신 요청 실패:", error.response?.data?.message);
        }
        return castError(error)
    }
}