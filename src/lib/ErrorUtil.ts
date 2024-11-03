import {AxiosError, isAxiosError} from "axios";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export const isError = (error: unknown): error is Error => {
    return error instanceof Error;
};

export const getErrorMessage = (error: unknown): string => {
    if (isError(error)) {
        return error.message;
    }
    if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        return error.message;
    }
    return "알 수 없는 에러";
};

export const getErrorName = (error: unknown): string => {
    if (isError(error)) {
        return error.name;
    }
    if (error && typeof error === "object" && "name" in error && typeof error.name === "string") {
        return error.name;
    }
    return "알 수 없는 에러";
};
// export const getErrorState = (error: unknown): string => {
//     if (isError(error)) {
//         return error.state;
//     }
//     if (error && typeof error === "object" && "name" in error && typeof error.name === "string") {
//         return error.state;
//     }
//     return "알 수 없는 에러";
// }
export const setErrorMessage = (error: unknown, message: string): void => {
    if (isError(error)) {
        error.message = message;
    } else if (error && typeof error === "object") {
        (error as Record<string, unknown>).message = message;
    }
};

export const setErrorName = (error: unknown, name: string): void => {
    if (isError(error)) {
        error.name = name;
    } else if (error && typeof error === "object") {
        (error as Record<string, unknown>).name = name;
    }
};
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