import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../function/cropHelper.ts';
import {AnimatePresence,motion} from "framer-motion"; // 크롭된 이미지를 처리하는 헬퍼 함수

type ProfileImageCropperProps = {
    imageSrc: string;
    onCropped: (croppedImageUrl: Blob) => void;
    onClose: () => void; //모달 닫기
};

const ProfileImageCropper: React.FC<ProfileImageCropperProps> = ({ imageSrc, onCropped, onClose }) => {
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // 크롭된 이미지 처리
    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (croppedImage instanceof Error) {
                console.error('크롭 실패 : ', croppedImage);
                return;
            }

            onCropped(croppedImage); // 크롭된 이미지를 부모 컴포넌트에 전달
            onClose(); // 크롭 모달 닫기
        } catch (e) {
            console.error(e);
        }
    }, [croppedAreaPixels, imageSrc, onCropped, onClose]);

    return (
        <AnimatePresence>
            <motion.div
                style={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    style={styles.modal}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div style={styles.cropContainer}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // 1:1 비율로 크롭
                        cropShape="round" // 사각형 크롭 영역 (원형으로 변경하려면 'round'로 설정)
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        objectFit="vertical-cover" // 이미지의 맞춤 방식 cover,horizental-cover,vertical-cover
                    />
                    </div>
                    <div style={styles.controls}>
                        <div style={styles.buttonContainer}>
                            <button onClick={onClose} style={styles.button}>
                                취소
                            </button>
                            <button onClick={showCroppedImage} style={styles.button}>
                                크롭 완료
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileImageCropper;

const styles: { [key : string]: React.CSSProperties} = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    cropContainer: {
        position: 'relative',
        width: '80vw',
        height: '80vw',
        maxWidth: '400px',
        maxHeight: '400px',
        background: '#000333',
    },
    controls: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
    },
}