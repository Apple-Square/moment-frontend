import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import styles from "../css/MediaUploader.module.css";   // override styles
// import SvgDel from "./SvgDel";
import 'swiper/css';
import SvgVideo from './SvgVideo';

interface UrlViewerProps {
    media: string[];
    type: string
}

const UrlViewer: React.FC<UrlViewerProps> = ({ media, type }) => {
    const [previewList, setPreviewList] = useState<string[]>(media);
    const swiperRef = useRef<SwiperCore>();

    return (
        <div className={styles.mediaUploader}>
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
                            {type.startsWith("VIDEO") && (
                                <SvgVideo className={styles.videoBanner} />
                            )}
                            {/* <SvgDel className={styles.deleteBtn} onClick={() => handleDeleteMedia(index)} /> 삭제금지 */}
                        </SwiperSlide>
                    ))
                )}
                {/* {(previewList.length < 10) && (     추가 금지
                    <SwiperSlide>
                        <div className={styles.mediaPreview}>
                            <button className={styles.uploadBtn} onClick={handleUploadClick}>미디어 업로드</button>
                        </div>
                    </SwiperSlide>
                )} */}
            </Swiper>
        </div>
    );
};

export default UrlViewer;