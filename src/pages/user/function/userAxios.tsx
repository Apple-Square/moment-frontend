import {axiosInstance, axiosInstanceWithFormData} from "../../../lib/axiosInstance.ts";
import {objectDeepDigger} from "../../../lib/deepLog.ts";
import axios from "axios";




export const getMeRequest = async () => {
    try {
        const response = await axiosInstance.get(`users/me`);
        console.log(`meRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`meRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return error;
    }
}

export const updateMeRequest = async (key : string, value : string) => {
    try {
        const response = await axiosInstance.patch(`users?${key}=${value}}`);
        console.log(`updateMeRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`updateMeRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return error;
    }
}
/**
 *
 * @param file
 * @param userId 나의 아이디
 */
export const updateProfileImageRequest = async (file : string | Blob, userId : string) => {
    try {
        const formData = new FormData();
        formData.append('profileImage', file);
        const response = await axiosInstanceWithFormData.put(`users/${userId}/profile-image`, formData);
        console.log(`updateProfileImageRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`updateProfileImageRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return error;
    }
}

export const deleteProfileImageRequest = async (userId : string) => {
    try {
        const response = await axiosInstanceWithFormData.delete(`users/${userId}/profile-image`);
        console.log(`deleteProfileImageRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`deleteProfileImageRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return error;
    }
}

export const followRequest = async (followeeId : string) => {
    try {
        const response = await axiosInstance.post(`users/${followeeId}/follow`);
        console.log(`followRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`followRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return error;
    }
}

export const followCancelRequest = async (followeeId : string) => {
    try {
        const response = await axiosInstance.delete(`users/${followeeId}/follow`);
        console.log(`followCancelRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`followCancelRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return error;
    }
}

export const getProfileRequest = async (userId : string) => {
    try {
        const response = await axiosInstance.get(`users/${userId}`);
        console.log(`getUserInfoRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`getUserInfoRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return error;
    }
}

export const getFollowersRequest = async (userId : string) => {
    try {
        const response = await axiosInstance.get(`users/${userId}/followers`);
        console.log(`getFollowersRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`getFollowersRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return error;
    }
}

export const getFollowingsRequest = async (userId : string) => {
    try {
        const response = await axiosInstance.get(`users/${userId}/followings`);
        console.log(`getFollowingsRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`getFollowingsRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return error;
    }
}

//미완성
export const getUserPostsRequest = async (userId : string) => {
    try {
        const response = await axiosInstance.get(`users/${userId}/posts`);
        console.log(`getUserPostsRequest에서 response :: ${JSON.stringify(response, null, 2)}`);
        return response;
    } catch (error) {
        console.error(`getUserPostsRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
        return error;
    }
}