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