import {
    axiosInstance, 
    axiosInstanceWithAccessToken,
    axiosInstanceWithFormData,
    axiosInstanceWithFormDataAndToken, 
    tokenManager
} from "../../../lib/axiosInstance.ts";
import { objectDeepDigger } from "../../../lib/deepLog.ts";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { castError } from "../../../lib/ErrorUtil.ts";

export interface UserProfile {
    id: string;
    nickname: string;
    profileImage: string;
}

export interface Comment {
    id: number;
    regDate: string;
    content: string;
    writer: UserProfile;
    likeCount: number;
    liked: boolean;
}

interface CommentResponse {
    timeStamp: string;
    hasNext: boolean;
    message: string;
    content: Comment[];
}

interface CommentUpdateResponse {
    timeStamp: string;
    id: number;
    message: string;
}

/**
 * 댓글 목록 조회
 * @param postId
 * @param size
 * @param cursor
 * @return AxiosResponse
 */
export const getCommentRequest = async (    
    postId: number | null,
    size: number = 10,                      // 왜 게시물이랑 반대지
    cursor: number | null = null
): Promise<AxiosResponse<CommentResponse> | Error> => {
    if (!postId) {
        return new Error(`commentRequest에서 Error :: postId is null`)
    }

    try {
        const response = await axiosInstance.get<CommentResponse>(`posts/${postId}/comments`, {
            params: { size, cursor },
        });
        console.log(`commentRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`commentRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}

/**
 * 게시글 작성
 * @param postId - 포스트ID
 * @param content - 댓글 내용
 * @returns AxiosResponse
 */
export const createCommentRequest = async (
    postId: number,
    content: string
): Promise<AxiosResponse<CommentUpdateResponse> | Error> => {
    try {
        const response = await axiosInstanceWithFormDataAndToken.post<CommentUpdateResponse>(
            `/posts/${postId}/comments`,
            { content }
        );

        console.log(`createPostRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`createPostRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
};


/**
 * 게시글 삭제
 */
export const deleteFeedRequest = async (postId: number): Promise<AxiosResponse<CommentResponse> | Error> => {
    try {
        const response = await axiosInstanceWithAccessToken.delete<CommentResponse>(`posts/${postId}`);
        console.log(`deleteFeedRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`deleteFeedRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}

/**
 * 게시글 수정
 * @param commentId - 댓글ID
 * @param content - 댓글 내용
 * @returns AxiosResponse
 */
export const updateCommentRequest = async (
    commentId: number,
    content: string
): Promise<AxiosResponse<CommentUpdateResponse> | Error> => {
    try {
        const response = await axiosInstanceWithFormDataAndToken.patch<CommentUpdateResponse>(
            `/comments/${commentId}`,
            { content }
        );

        console.log(`updateCommentRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`updateCommentRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
};
