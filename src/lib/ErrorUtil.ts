import axios, {AxiosError, } from "axios";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

//true를 리턴하면 eror는 Error 타입을 보장.
export const isError = (error: unknown): error is Error => {
    return <boolean>(error instanceof Error || (error && typeof error === "object" && "name" in error && "message" in error));
};
const isAxiosError = (error: unknown): error is AxiosError => {
    return axios.isAxiosError(error);
};
// `status` 속성이 있는지 확인하는 타입 가드
const hasStatus = (error: unknown): error is { status: number } => {
    return typeof error === "object" && error !== null && "status" in error && typeof (error as any).status === "number";
};

/**
 * 안전하게 에러메세지를 가져오는 명령어
 * 에러메세지가 배열인 경우에 하나의 string으로 가져온다.
 * 어느 때는 배열이고 어느 때는 string인 에러메세지를 안전하게 받는다.
 * @param error
 */
export const gerServerErrorMessage = (error: unknown): string => {
    if (isError(error)) {
        return extractServerMessage(error);
    }
    return "알 수 없는 에러";
};
export const getErrorMessage = (error : unknown) : string => {
    if (isError(error)) {
        return extractMessage(error);
    }
    return "알 수 없는 에러"
}

const extractServerMessage = (error: any): string => {
    try {
        const responseData = error.response?.data;
        if (Array.isArray(responseData.message)) {
            return responseData.message.join(", ");
        } else if (typeof responseData.message === "string") {
            return responseData.message;
        }
    } catch (e) {
        console.error("메시지 추출 실패:", e);
    }
    return "에러 메세지 추출 실패";
};

const extractMessage = (error: any): string => {
    try {
        const responseData = error;
        if (Array.isArray(responseData.message)) {
            return responseData.message.join(", ");
        } else if (typeof responseData.message === "string") {
            return responseData.message;
        }
    } catch (e) {
        console.error("메시지 추출 실패:", e);
    }
    return "잘못된 요청입니다. 입력값을 확인해주세요.";
};

export const getErrorName = (error: unknown): string => {
    if (isError(error)) {
        return error.name;
    }
    return "알 수 없는 에러";
};
export const getErrorStatus = (error: unknown): number => {
    if (isError(error) && hasStatus(error)) {
        return error.status;
    }
    return -1;
}
export const setErrorMessage = (error: unknown, message: string): void => {
    if (isAxiosError(error)) {
        if (error.response && typeof error.response.data === 'object') {
            (error.response.data as { message?: string }).message = message;
        }
    } else if (isError(error)) {
        error.message = message;
    }
};


export const setErrorName = (error: unknown, name: string): void => {
    if (isError(error)) {
        error.name = name;
    }
};
// AxiosError를 Error로 변환하는 함수
export const castError = (error: unknown): Error => {
    if (isAxiosError(error)) {
        console.log(Object.getOwnPropertyDescriptors(error));
        if (!error.response) {
            return new Error("네트워크 에러");
        }

        // message 속성에 안전하게 접근
        const message = error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
            ? (error.response.data as { message: string }).message
            : "알 수 없는 axios 에러 발생";

        const axiosError = new Error(message);  // Error로 변환
        // AxiosError의 모든 속성을 Error 객체에 복사
        (axiosError as any).config = error.config;
        (axiosError as any).request = error.request;
        (axiosError as any).response = error.response;
        (axiosError as any).isAxiosError = error.isAxiosError;
        return axiosError;
    }

    if (error instanceof Error) {
        return error;  // 이미 Error인 경우 그대로 반환
    }

    return new Error(String(error));  // 알 수 없는 에러는 문자열로 변환 후 Error로 생성
};