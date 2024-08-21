import React from "react";
import styles from "../css/ImageUploader.module.css";

interface ImageUploaderProps {
    onImageChange: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageChange(event.target.files[0]);
        }
    };

    return (
        <div className={styles.imageUploader}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
    );
};

export default ImageUploader;