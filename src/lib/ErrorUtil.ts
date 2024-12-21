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

export const getErrorMessage = (error: unknown): string => {
    if (isError(error)) {
        return error.message;
    }
    return "알 수 없는 에러";
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
    if (isError(error)) {
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
        const axiosError = new Error(error.message);  // Error로 변환
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