import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import styles from "../css/MediaUploader.module.css";
import DelImg from "../../../assets/close.svg";
import 'swiper/css';

interface MediaUploaderProps {
    contents: File[];
    onMediaChange: (contents: File[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ contents, onMediaChange }) => {
    const [previewList, setPreviewList] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const swiperRef = useRef<SwiperCore>();

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    const handleDeleteMedia = (index: number) => {
        // contents(file[])에서 제외
        const updatedContents = contents.filter((_, idx) => idx !== index);
        onMediaChange(updatedContents);
        
        // preview(string[])에서 제외
        const updatedPreviewList = previewList.filter((_, idx) => idx !== index);
        setPreviewList(updatedPreviewList);
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const fileArray = [...contents, ...Array.from(event.target.files)];

            if (fileArray.length > 10) {
                alert("미디어는 10개까지만 첨부 가능합니다.");
                const limitedArray = fileArray.slice(0, 10);
                onMediaChange(limitedArray);
                await updatePreviewList(limitedArray);
            } else {
                onMediaChange(fileArray);
                await updatePreviewList(fileArray);
            }
        } else {
            setPreviewList(previewList);
            onMediaChange(contents);    // 업로드 없을 시 변화 없음
            // if (swiperRef.current) {
            //     swiperRef.current.slideTo(0);
            // }
        }
    };

    const updatePreviewList = async (files: File[]) => {
        const filePreviews: string[] = [];
        for (const file of files) {
            const preview = await readFile(file);
            filePreviews.push(preview);
        }
        
        setPreviewList(filePreviews);
    }

    const readFile = (file:File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    resolve(reader.result as string);
                } else {
                    reject(new Error('Failed to read file'));
                }
            };
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            reader.readAsDataURL(file);
        });
    }

    return (
        <div className={styles.mediaUploader}>
            <input  // hidden tag
                type="file"
                accept="image/*, video/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            {/* swipper setting */}
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
                                className={styles.mediaPreview}
                                style={{
                                    backgroundImage: `url(${preview})`,
                                }}
                            ></div>
                            {/* svg 이미지 변경 필요 */}
                            <img src={DelImg} className={styles.deleteBtn} onClick={() => handleDeleteMedia(index)} />
                        </SwiperSlide>
                    ))
                )}
                {(previewList.length < 10) && (
                    <SwiperSlide>
                        <div className={styles.mediaPreview}>
                            <button className={styles.uploadBtn} onClick={handleUploadClick}>미디어 업로드</button>
                        </div>
                    </SwiperSlide>
                )}
            </Swiper>
        </div>
    );
};

export default MediaUploader;