import { useState, useEffect, useRef } from 'react';
import {updateProfileImageRequest, UserPage, UserPagePocket} from '../function/userAxiosRequest.tsx';
import {Updater} from "use-immer";

const useProfileImage = (userPage : UserPage, updateUserPagePocket : Updater<UserPagePocket>, myId : string) => {
    const [isCropping, setIsCropping] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setUploadedImage(reader.result as string);
                    setIsCropping(true);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropped = async (croppedImageBlob: Blob) => {
        try {
            // 서버에 크롭된 이미지 저장
            const response = await updateProfileImageRequest(croppedImageBlob, myId);

            if (response instanceof Error) {
                console.error("프로필 이미지 업데이트 실패: ", response);
                return;
            }

            setIsCropping(false);
            updateUserPagePocket(draft => {
                // Blob을 서버에서 저장한 URL로 교체
                draft.userPage.user.profileImage = URL.createObjectURL(croppedImageBlob); // 임시로 Blob URL 사용
            });
        } catch (error) {
            console.error("handleCropped에서 에러 발생: ", error);
        }
    };
    const handleImageError = (e) => {
        e.target.src = `${import.meta.env.BASE_URL}images/defaultProfileImage.jpg`;
    }

    const closeCropper = () => {
        setIsCropping(false);
    };

    // 크롭 모드일 때 body 스크롤 막기
    useEffect(() => {
        if (isCropping) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isCropping]);

    return {
        isCropping,
        uploadedImage,
        fileInputRef,
        handleImageClick,
        handleImageError,
        handleFileChange,
        handleCropped,
        closeCropper
    };
};

export default useProfileImage;
