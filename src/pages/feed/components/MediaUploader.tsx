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
        // close 버튼 누르면 이미지 삭제
        // contents(file[])에서 제외
        const updatedContents = contents.filter((_, idx) => idx !== index);
        onMediaChange(updatedContents);
        // preview(string[])에서 제외
        const updatedPreviewList = previewList.filter((_, idx) => idx !== index);
        setPreviewList(updatedPreviewList);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const mediaArray = [...contents, ...Array.from(event.target.files)];

            if (mediaArray.length > 10) {
                alert("미디어는 10개까지만 첨부 가능합니다.");
            }
            onMediaChange(mediaArray.slice(0, 10));

            // bug: 용량이 큰 이미지가 뒤로 가게 됨
            const newPreviews: string[] = [];
            mediaArray.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        newPreviews.push(reader.result as string);

                        // after all loaded
                        if (newPreviews.length === mediaArray.length) {
                            setPreviewList(newPreviews);
                            // if (swiperRef.current) {
                            //     swiperRef.current.slideTo(0);
                            // }
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            setPreviewList(previewList);
            onMediaChange(contents);
            // if (swiperRef.current) {
            //     swiperRef.current.slideTo(0);
            // }
        }
    };

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