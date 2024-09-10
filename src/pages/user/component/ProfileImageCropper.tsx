import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../function/cropHelper.ts'; // 크롭된 이미지를 처리하는 헬퍼 함수

type ProfileImageCropperProps = {
    imageSrc: string;
    onCropped: (croppedImageUrl: string) => void;
};

const ProfileImageCropper: React.FC<ProfileImageCropperProps> = ({ imageSrc, onCropped }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // 크롭된 이미지 처리
    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropped(croppedImage as string); // 크롭된 이미지를 부모 컴포넌트에 전달
        } catch (e) {
            console.error(e);
        }
    }, [croppedAreaPixels, imageSrc, onCropped]);

    return (
        <div>
            <div
                style={{
                    position: 'relative',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    overflow: 'hidden',
                }}
            >
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1} // 1:1 비율로 크롭
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
            <button onClick={showCroppedImage}>크롭 완료</button>
        </div>
    );
};

export default ProfileImageCropper;
