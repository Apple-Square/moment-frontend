import React, { useRef, useState } from 'react';
import styles from "../css/ImageUploader.module.css";

interface ImageUploaderProps {
    onImageChange: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const imgArray = Array.from(event.target.files).slice(0, 10);

            if (event.target.files.length > 10) {
                alert("이미지는 10개까지만 첨부 가능합니다.");
            }
            onImageChange(imgArray[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(imgArray[0]);
        } else {
            setPreview(null);
            onImageChange(null);
        }
    };

    return (
        <div className={styles.imageUploader}>
            <input  // hidden tag
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <div
                className={styles.imagePreview}
                style={{
                    backgroundImage: preview ? `url(${preview})` : 'none'
                }}
            >
                {!preview && (
                    <button className={styles.uploadBtn} onClick={handleUploadClick}>이미지 업로드</button>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;