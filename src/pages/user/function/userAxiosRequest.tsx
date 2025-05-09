import {
    axiosInstance, axiosInstanceWithAccessToken,
    axiosInstanceWithFormData,
    axiosInstanceWithFormDataAndToken, tokenManager
} from "../../../lib/axiosInstance.ts";
import axios, {AxiosError, AxiosResponse} from "axios";
import {castError} from "../../../lib/ErrorUtil.ts";


interface UserProfile {
    id: string;
    nickname: string;
    profileImage: string;
}
interface GetMeResponse {
    timeStamp: string;
    message: string;
    user: UserProfile;
}
interface updateProfileImageResponse {
    timeStamp: string;
    message: string;
    userId: string;
}
/**
 * 나의 정보 조회
 */
export const getMeRequest = async (): Promise<AxiosResponse<GetMeResponse> | Error> => {
    try {
        const response = await axiosInstanceWithAccessToken.get(`users/me`);
        console.log(`meRequest 성공: 사용자 ID 조회 완료`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(`meRequest 에러: ${error.response?.data?.message}`);
        } else {
            console.error(`meRequest 알 수 없는 에러 발생`);
        }
        return castError(error);
    }
}
/**
 * 유저 정보 수정
 * @param key
 * @param value
 */
export const updateMeRequest = async (userId : string, user : any) : Promise<string | Error> => {
    try {
        const response = await axiosInstanceWithAccessToken.patch(`users/${userId}`, user);
        console.log(`updateMeRequest 성공: 업데이트된 사용자 ID - ${response.data.userId}`);
        return response.data?.userId;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(`updateMeRequest 에러: ${error.response?.data?.message}`);
        } else {
            console.error(`updateMeRequest 알 수 없는 에러 발생`);
        }
        return castError(error);
    }
}
/**
 * 프로필 사진 설정
 * Blob은 File의 부모임
 * @param file
 * @param userId 나의 아이디
 */
export const updateProfileImageRequest = async (file: Blob, userId: string): Promise<AxiosResponse<updateProfileImageResponse> | Error> => {
    try {
        const formData = new FormData();
        const fileObj = new File([file], 'profileImage.jpg', { type: 'image/jpeg' }); // Blob을 File로 변환
        formData.append('profileImage', fileObj); // FormData에 File 객체 추가


        formData.forEach((value, key) => {
            console.log(`FormData에 담긴 데이터 - key: ${key}, value:`, value);
        });

        const response = await axiosInstanceWithFormDataAndToken.put(`/users/${userId}/profile-image`, formData);
        console.log(`updateProfileImageRequest에서 response :: ${JSON.stringify(response.data.message, null, 2)}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(`updateProfileImageRequest에서 에러 :: ${error.response?.data?.message}`);
        } else {
            console.error(`updateProfileImageRequest에서 알 수 없는 에러 발생`);
        }
        return castError(error);
    }
};

export const deleteProfileImageRequest = async (userId : string) : Promise<AxiosResponse<any, any> | Error> => {
    try {
        const response = await axiosInstanceWithFormDataAndToken.delete(`users/${userId}/profile-image`);
        console.log(`deleteProfileImageRequest에서 response :: ${JSON.stringify(response.data.message, null, 2)}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(`deleteProfileImageRequest에서 에러 :: ${error.response?.data?.message}`);
        } else {
            console.error(`deleteProfileImageRequest에서 알 수 없는 에러 발생`);
        }
        return castError(error);
    }
};

export const followRequest = async (followeeId : string) : Promise<string | Error> => {
    try {
        const response = await axiosInstanceWithAccessToken.post(`users/${followeeId}/follow`);
        console.log(`followRequest에서 response :: ${JSON.stringify(response.data.message, null, 2)}`);
        return response?.data?.followeeId;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(`AxiosError 발생 :: 상태 코드: ${error.response?.status}, 메시지: ${error.response?.data?.message}`);
        } else {
            console.error(`알 수 없는 에러 발생 :: ${JSON.stringify(error, null, 2)}`);
        }
        return castError(error);
    }
};

export const followCancelRequest = async (followeeId : string) : Promise<string | Error> => {
    try {
        const response = await axiosInstanceWithAccessToken.delete(`users/${followeeId}/follow`);
        console.log(`followCancelRequest에서 response :: ${JSON.stringify(response.data.message, null, 2)}`);
        return response?.data?.followeeId;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(`followCancelRequest에서 에러 :: ${error.response?.data?.message}`);
        } else {
            console.error(`followCancelRequest에서 알 수 없는 에러 발생`);
        }
        return castError(error);
    }
};

export interface User {
    id: string;
    nickname: string;
    regDate: string;
    birth: string;
    gender: string;
    address: string;
    intro: string;
    profileImage: string;
}

export interface UserPage {
    user: Pick<User, 'id' | 'nickname' | 'profileImage' | 'intro' | 'regDate' | 'birth' | 'gender' | 'address'>; // 필요한 속성만 선택
    postCount: number;
    followerCount: number;
    followingCount: number;
    followed: boolean;
}

export interface UserPagePocket {
    userPage : UserPage;
};

export const getProfileRequest = async (userId : string) : Promise<UserPagePocket | Error> => {
    try {
        let response;
        console.log(userId ? "userId가 있음" : "userId가 없음");

        if(tokenManager.getToken() !== ""){
            // response
            response = await axiosInstanceWithAccessToken.get(`users/${userId}`);
        } else {
            response = await axiosInstance.get(`users/${userId}`);
        }
        console.log(`getProfileRequest에서 response :: ${JSON.stringify(response.data.message, null, 2)}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(`getProfileRequest에서 에러 :: ${error.response?.data?.message}`);
        } else {
            console.error(`getProfileRequest에서 알 수 없는 에러 발생`);
        }
        return castError(error);
    }
}
export interface UserOfFollowList {
    followId: number;              // 사용자 ID
    userId: string;
    nickname: string;        // 사용자 닉네임
    profileImage: string;    // 프로필 이미지 URL
    followed: boolean;       // 팔로우 여부
}
export interface FollowListPocket {
    content: UserOfFollowList[];         // 여러 사용자 정보를 담은 배열
    hasNext : boolean;
}

export const getFollowersRequest = async (userId: string, size: number, cursor: number): Promise<FollowListPocket | Error> => {
    try {
        let response;
        const url = cursor > 0 
            ? `users/${userId}/followers/search?size=${size}&cursor=${cursor}`
            : `users/${userId}/followers/search?size=${size}`;

        if (tokenManager.getToken() !== "") {
            response = await axiosInstanceWithAccessToken.get(url);
        } else {
            response = await axiosInstance.get(url);
        }
        
        console.log(`getFollowersRequest에서 response :: ${JSON.stringify(response.data.message, null, 2)}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(`getFollowersRequest에서 에러 :: ${error.response?.data?.message}`);
        } else {
            console.error(`getFollowersRequest에서 알 수 없는 에러 발생`);
        }
        return castError(error);
    }
}

export const getFollowingsRequest = async (userId: string, size: number, cursor: number): Promise<FollowListPocket | Error> => {
    try {
        let response;
        const url = cursor > 0 
            ? `users/${userId}/followings/search?size=${size}&cursor=${cursor}`
            : `users/${userId}/followings/search?size=${size}`;

        if (tokenManager.getToken() !== "") {
            response = await axiosInstanceWithAccessToken.get(url);
        } else {
            response = await axiosInstance.get(url);
        }
        
        console.log(`getFollowingsRequest에서 response :: ${JSON.stringify(response.data.message, null, 2)}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(`getFollowingsRequest에서 에러 :: ${error.response?.data?.message}`);
        } else {
            console.error(`getFollowingsRequest에서 알 수 없는 에러 발생`);
        }
        return castError(error);
    }
}

//미완성 아직 없음!!!!!!!
export const getUserPostsRequest = async (userId : string) : Promise<AxiosResponse<any, any> | Error> => {
    try {
        const response = await axiosInstance.get(`users/${userId}/posts`);
        console.log(`getUserPostsRequest에서 response :: ${JSON.stringify(response.data.message, null, 2)}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error(`getUserPostsRequest에서 에러 :: ${error.response?.data?.message}`);
        } else {
            console.error(`getUserPostsRequest에서 알 수 없는 에러 발생`);
        }
        return castError(error);
    }
}