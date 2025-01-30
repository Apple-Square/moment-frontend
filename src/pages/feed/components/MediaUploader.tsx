import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import styles from "../css/MediaUploader.module.css";
import SvgDel from "./SvgDel";
import 'swiper/css';
import SvgVideo from './SvgVideo';

interface MediaUploaderProps {
    contents: File[];
    onMediaChange: (contents: File[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ contents, onMediaChange }) => {
    const [previewList, setPreviewList] = useState<{ src: string; type: string }[]>([]);
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

    // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.files && event.target.files[0]) {
    //         const fileArray = [...contents, ...Array.from(event.target.files)];

    //         if (fileArray.length > 10) {
    //             alert("미디어는 10개까지만 첨부 가능합니다.");
    //             const limitedArray = fileArray.slice(0, 10);
    //             onMediaChange(limitedArray);
    //             await updatePreviewList(limitedArray);
    //         } else {
    //             onMediaChange(fileArray);
    //             await updatePreviewList(fileArray);
    //         }

    //         console.log(contents)
    //     } else {
    //         setPreviewList(previewList);
    //         onMediaChange(contents);    // 업로드 없을 시 변화 없음
    //         // if (swiperRef.current) {
    //         //     swiperRef.current.slideTo(0);
    //         // }
    //     }
    // };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files);
            const fileTypes = contents.map(file => file.type.split('/')[0]);
            const newFileTypes = newFiles.map(file => file.type.split('/')[0]);

            if (
                fileTypes.includes('image') && newFileTypes.includes('video') ||
                fileTypes.includes('video') && newFileTypes.includes('image') ||
                newFileTypes.includes('video') && newFileTypes.includes('image')
            ) {
                alert("이미지와 비디오는 동시에 업로드할 수 없습니다.");
                return;
            }

            if (newFileTypes.includes('video')) {
                if (newFiles.length > 1 || contents.length > 0) {
                    alert("비디오는 최대 1개까지만 업로드할 수 있습니다.");
                    return;
                }
            }

            if (newFileTypes.includes('image')) {
                const totalImages = contents.filter(file => file.type.startsWith('image')).length + newFiles.length;
                if (totalImages > 10) {
                    alert("이미지는 최대 10개까지만 업로드할 수 있습니다.");
                    return;
                }
            }

            const updatedContents = [...contents, ...newFiles];
            onMediaChange(updatedContents);
            await updatePreviewList(updatedContents);
        }
    };

    const updatePreviewList = async (files: File[]) => {
        const filePreviews: { src: string; type: string }[] = [];
        for (const file of files) {
            const preview = await (file.type.startsWith('video/') ? readVideo(file) : readFile(file));
            filePreviews.push({ src: preview, type: file.type });
        }

        setPreviewList(filePreviews);
    }

    const readFile = (file: File): Promise<string> => {
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

    const readVideo = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = URL.createObjectURL(file);

            video.onloadeddata = () => {
                video.currentTime = Math.min(video.duration / 2, 1); // Get thumbnail from mid
            };

            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL());
                } else {
                    reject(new Error('Failed to get video thumbnail'));
                }
                video.src = ''; // Clean up
            };

            video.onerror = () => {
                reject(new Error('Failed to process video'));
            };
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
                                    backgroundImage: `url(${preview.src})`,
                                }}
                            ></div>
                            {preview.type.startsWith("video/") && (
                                <SvgVideo className={styles.videoBanner} />
                            )}
                            <SvgDel className={styles.deleteBtn} onClick={() => handleDeleteMedia(index)} />
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