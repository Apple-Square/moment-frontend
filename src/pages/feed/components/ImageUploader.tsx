import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import styles from "../css/ImageUploader.module.css";
import  DelImg from "../../../assets/close.svg";
import 'swiper/css';

interface ImageUploaderProps {
    contents: File[];
    onImageChange: (contents: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ contents, onImageChange }) => {
    const [previewList, setPreviewList] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const swiperRef = useRef<SwiperCore>();

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    const handleDeleteImage = () => {
        // close 버튼 누르면 이미지 삭제
        // contents(file[])에서 제외
        // preview(string[])에서 제외
    } 

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const imgArray = Array.from(event.target.files).slice(0, 10);

            if (event.target.files.length > 10) {
                alert("이미지는 10개까지만 첨부 가능합니다.");
            }
            onImageChange(imgArray);

            const newPreviews: string[] = [];
            imgArray.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        newPreviews.push(reader.result as string);

                        // after all loaded
                        if (newPreviews.length === imgArray.length) {
                            setPreviewList(newPreviews);
                            if (swiperRef.current) {
                                swiperRef.current.slideTo(0);
                            }
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            setPreviewList([]);
            onImageChange([]);
            if (swiperRef.current) {
                swiperRef.current.slideTo(0);
            }
        }
    };

    return (
        <>
            <div className={styles.imageUploader}>
                <input  // hidden tag
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <Swiper
                    className={styles.prevSlide}
                    style={{ position: 'absolute' }}      // css bug point
                    slidesPerView={1}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        console.log(swiper);
                    }}
                >
                    {previewList && (
                        previewList.map((preview, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className={styles.imagePreview}
                                    style={{
                                        backgroundImage: `url(${preview})`,
                                    }}
                                ></div>
                                <img src={DelImg} className={styles.deleteBtn} onClick={handleDeleteImage}/>
                            </SwiperSlide>
                        ))
                    )}
                    {(previewList.length < 10) && (
                        <SwiperSlide>
                            <div className={styles.imagePreview}>
                                <button className={styles.uploadBtn} onClick={handleUploadClick}>이미지 업로드</button>
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
        </>
    );
};

export default ImageUploader;