import {
    axiosInstance, axiosInstanceWithAccessToken,
    axiosInstanceWithFormData,
    axiosInstanceWithFormDataAndToken, tokenManager
} from "../../../lib/axiosInstance.ts";
import { objectDeepDigger } from "../../../lib/deepLog.ts";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { castError } from "../../../lib/ErrorUtil.ts";

export interface UserProfile {
    id: string;
    nickname: string;
    profileImage: string;
}

export interface Feed {
    id: number;
    regDate: string;
    content: string;
    writer: UserProfile;
    tags: string[];
    mediaType: "IMAGE" | "VIDEO"; // Add other media types if needed
    urls: string[];
    address: string;
    x: number; // Longitude
    y: number; // Latitude
    viewCount: number;
    commentCount: number;
    likeCount: number;
    liked: boolean;
    commented: boolean;
}

interface FeedResponse {
    timeStamp: string;
    hasNext: boolean;
    message: string;
    content: Feed[];
}

interface FeedIDResponse {
    timeStamp: string;
    post: Feed;
    message: string;
}

interface FeedUpdateResponse {
    timeStamp: string;
    id: number;
    message: string;
}

/**
 * 게시글 목록 조회
 * return : AxiosResponse
 */
type FeedType = 'detail' | 'thumbnail';
export const getFeedRequest = async (
    type: FeedType = 'detail',
    cursor: number | null = null,
    size: number = 10
): Promise<AxiosResponse<FeedResponse> | Error> => {
    try {
        const response = await axiosInstance.get<FeedResponse>(`posts`, {
            params: { type, cursor, size },
        });
        console.log(`feedRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`feedRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}

/**
 * 개별 게시글 조회
 * return : AxiosResponse
 */
export const getFeedIDRequest = async (
    id: number
): Promise<AxiosResponse<FeedIDResponse> | Error> => {
    try {
        const response = await axiosInstance.get<FeedIDResponse>(`posts/${id}`);        //axiosInstanceWithAccessToken이 필요하지 않은 듯
        console.log(`feedRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`feedRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}

/**
 * 게시글 작성
 * @param files - 첨부파일 리스트 (Image[] | Video)
 * @param content - 게시글 내용 (선택) : front단에서는 text contents 필수
 * @param tags - 태그 리스트 (선택)
 * @param address - 주소 정보 (선택)
 * @returns AxiosResponse
 */
export const createFeedRequest = async (
    files: File[], // 첨부 파일 리스트
    content?: string, // 게시글 내용
    tags?: string[], // 태그 리스트
    address?: string // 주소
): Promise<AxiosResponse<{ success: boolean; postId: number }> | Error> => {
    // 파일 유효성 검사
    if (files.length <= 0) {
        throw new Error('파일은 반드시 하나 이상 등록해야 합니다.');
    }

    if (files.some(file => file.type.startsWith('image')) && files.some(file => file.type.startsWith('video'))) {
        throw new Error('영상과 사진은 같이 등록할 수 없습니다.');
    }

    if (files.length > 10 && files[0].type.startsWith('image')) {
        throw new Error('사진은 최대 10개까지 등록할 수 있습니다.');
    }

    if (files.length > 1 && files[0].type.startsWith('video')) {
        throw new Error('영상은 최대 1개까지 등록할 수 있습니다.');
    }

    // FormData 생성
    const formData = new FormData();
    files.forEach(file => formData.append('files', file)); // 파일 추가

    if (content) formData.append('content', content); // 게시글 내용 추가
    if (tags) tags.forEach(tag => formData.append('tags', tag)); // 태그 추가
    if (address) formData.append('address', address); // 주소 추가

    try {
        const response = await axiosInstanceWithFormDataAndToken.post<{ success: boolean; postId: number }>(
            '/posts',
            formData
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
export const deleteFeedRequest = async (postId: number): Promise<AxiosResponse<FeedResponse> | Error> => {
    try {
        const response = await axiosInstanceWithAccessToken.delete<FeedResponse>(`posts/${postId}`);
        console.log(`deleteFeedRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`deleteFeedRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}

/**
 * 게시글 수정
 * @param urls - ////////////////////////// 사용 안 함 ////////////////////// 기존 파일 (선택)
 * @param files ////////////////////////// 사용 안 함 ////////////////////// - 새로 추가되는 파일 리스트 (Image[] | Video) (선택)
 * @param content - 게시글 내용 (선택) : front단에서는 text contents 필수
 * @param tags - 태그 리스트 (선택)
 * @param address - 주소 정보 (선택)
 * @returns AxiosResponse
 */
export const updateFeedRequest = async (
    postId: number,
    urls?: string[], // 기존 첨부 파일 리스트
    files?: File[], // 첨부 파일 리스트
    content?: string, // 게시글 내용
    tags?: string[], // 태그 리스트
    address?: string // 주소
): Promise<AxiosResponse<FeedUpdateResponse> | Error> => {
    // 파일 유효성 검사
    if (files) {
        if (files.some(file => file.type.startsWith('image')) && files.some(file => file.type.startsWith('video'))) {
            throw new Error('영상과 사진은 같이 등록할 수 없습니다.');
        }

        if (files.length > 10 && files[0].type.startsWith('image')) {
            throw new Error('사진은 최대 10개까지 등록할 수 있습니다.');
        }

        if (files.length > 1 && files[0].type.startsWith('video')) {
            throw new Error('영상은 최대 1개까지 등록할 수 있습니다.');
        }
    }

    const formData = new FormData();
    if (urls) urls.forEach(urls => formData.append('urls', urls))   // 기존 파일 변경사항 적용
    if (files) files.forEach(file => formData.append('files', file));   // 새 파일 추가

    if (content) formData.append('content', content); // 게시글 변경 내용 추가
    if (tags) tags.forEach(tag => formData.append('tags', tag)); // 태그 변경
    if (address) formData.append('address', address); // 주소 변경

    try {
        const response = await axiosInstanceWithFormDataAndToken.patch<FeedUpdateResponse>(
            `/posts/${postId}`,
            formData
        );

        console.log(`updateFeedRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`updateFeedRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
};
