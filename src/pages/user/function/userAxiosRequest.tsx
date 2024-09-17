import {
    axiosInstance, axiosInstanceWithAccessToken,
    axiosInstanceWithFormData,
    axiosInstanceWithFormDataAndToken, tokenManager
} from "../../../lib/axiosInstance.ts";
import {objectDeepDigger} from "../../../lib/deepLog.ts";
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
 * 나의 프로필 조회
 */
export const getMeRequest = async () : Promise<AxiosResponse<GetMeResponse> | Error> => {
    try {
        console.log("getMeRequest\n"+tokenManager.getToken());
        const response = await axiosInstanceWithAccessToken.get(`users/me`);
        console.log(`meRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`meRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}
/**
 * 유저 정보 수정
 * @param key
 * @param value
 */
export const updateMeRequest = async (key : string, value : string) : Promise<AxiosResponse<any, any> | Error> => {
    try {

        const response = await axiosInstanceWithAccessToken.patch(`users?${key}=${value}}`);
        console.log(`updateMeRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`updateMeRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
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
        console.log(`updateProfileImageRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`updateProfileImageRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
};

export const deleteProfileImageRequest = async (userId : string) : Promise<AxiosResponse<any, any> | Error> => {
    try {
        const response = await axiosInstanceWithFormDataAndToken.delete(`users/${userId}/profile-image`);
        console.log(`deleteProfileImageRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`deleteProfileImageRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}

export const followRequest = async (followeeId : string) : Promise<AxiosResponse<any, any> | Error> => {
    try {
        const response = await axiosInstanceWithAccessToken.post(`users/${followeeId}/follow`);
        console.log(`followRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`followRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}

export const followCancelRequest = async (followeeId : string) : Promise<AxiosResponse<any, any> | Error> => {
    try {
        const response = await axiosInstanceWithAccessToken.delete(`users/${followeeId}/follow`);
        console.log(`followCancelRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`followCancelRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}

export interface UserPagePocket {
    userPage : UserPage;
}
export interface UserPage {
    user : {
        id : string,
        nickname : string,
        regDate : string,
        birth : string,
        gender : string,
        address : string,
        intro : string,
        profileImage : string,
    },
    postCount : string,
    followerCount : string,
    followingCount : string,
    followed : boolean
}

export const getProfileRequest = async (userId : string) : Promise<UserPagePocket | Error> => {
    try {
        let response;
        if(tokenManager.getToken() !== ""){
            response = await axiosInstanceWithAccessToken.get(`users/${userId}`);
        } else {
            response = await axiosInstance.get(`users/${userId}`);
        }
        console.log(`getUserInfoRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response.data;
    } catch (error) {
        console.error(`getUserInfoRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}

export const getFollowersRequest = async (userId : string) : Promise<AxiosResponse<any, any> | Error> => {
    try {
        let response;
        if(tokenManager.getToken() !== ""){
            response = await axiosInstanceWithAccessToken.get(`users/${userId}/followers`);
        } else {
            response = await axiosInstance.get(`users/${userId}/followers`);
        }
        console.log(`getFollowersRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`getFollowersRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}

export const getFollowingsRequest = async (userId : string) : Promise<AxiosResponse<any, any> | Error> => {
    try {
        let response;
        if(tokenManager.getToken() !== "") {
            response = await axiosInstanceWithAccessToken.get(`users/${userId}/followings`);
        } else {
            response = await axiosInstance.get(`users/${userId}/followings`);
        }
        console.log(`getFollowingsRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`getFollowingsRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}

//미완성 아직 없음!!!!!!!
export const getUserPostsRequest = async (userId : string) : Promise<AxiosResponse<any, any> | Error> => {
    try {
        const response = await axiosInstance.get(`users/${userId}/posts`);
        console.log(`getUserPostsRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`getUserPostsRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return castError(error);
    }
}