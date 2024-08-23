import React, { useState } from 'react';
import styles from "../css/ImageUploader.module.css";

interface ImageUploaderProps {
    onImageChange: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageChange(event.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(event.target.files[0]);
        } else {
            setPreview(null);
            onImageChange(null);
        }
    };

    return (
        <div className={styles.imageUploader}>
            {!preview ? (
                <input type="file" accept="image/*" onChange={handleFileChange}/>
            ) : (
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                        backgroundImage: `url(${preview})`,
                    }}
                />
            )}
        </div>
    );
};

export default ImageUploader;