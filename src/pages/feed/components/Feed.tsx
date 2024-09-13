import React, { useEffect, useState } from 'react';
import styles from "../css/Feed.module.css";
import CommentList from './CommentList';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules'; 
import 'swiper/css/pagination';
// import SwiperCore from 'swiper';
import 'swiper/css';
// import { Col, Container, Row } from 'react-bootstrap';

interface FeedProps {
    profileImg: string
    author: string;
    location: string;
    images: string[];
    contents: string;
    likes: number;
    comments: number;
    shares: number;
    timeAgo: string;
}

const Feed: React.FC<FeedProps> = ({ profileImg, author, location, images, contents, likes, comments, shares, timeAgo }) => {
    const [visibleComment, setVisibleComment] = useState<boolean>(false);
    const navi = useNavigate();
    const locationPath = useLocation();
    const pagination = {
        clickable: false,
        renderBullet: function (index:number, className:string) {
          return '<span class="' + className + '"></span>';
        },
    };

    useEffect(() => {
        if (locationPath.pathname === '/feed/FeedDetail') {
            setVisibleComment(true);
        } else {
            setVisibleComment(false);
        }
    }, [locationPath]);

    const handleClickComment = () => {
        // setVisibleComment(!visibleComment);
        navi('/feed/FeedDetail');
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={`${styles.profile} p-2`}>
                    <img className={styles.profileImg} src={profileImg} alt="Profile" />
                    <div className={styles.authorInfo}>
                        <span className={styles.author}>{author}</span>
                        <span className={styles.location}>{location}</span>
                    </div>
                </div>
            </div>
            <div className={styles.imageContainer}>
                {/* <img className={styles.contentImg} src={img} alt="contents" /> */}
                <Swiper
                    className={styles.imgSlide}
                    style={{ position: 'absolute' }}      // css bug point
                    pagination={pagination}
                    modules={[Pagination]}
                    slidesPerView={1}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => {
                        console.log(swiper);
                    }}
                >
                    {images && images.map((img, index) => (
                        <SwiperSlide key={index}>
                        <img className={styles.contentImg} src={img} />
                    </SwiperSlide>
                    ))}
                    
                </Swiper>
            </div>
            <div className={styles.actions}>
                <span className={styles.likes}>👍 {likes}</span>
                <span className={styles.comments} onClick={handleClickComment}>💬 {comments}</span>
                <span className={styles.shares}>↗️ {shares}</span>
                <span className={styles.timeAgo}>{timeAgo}</span>
            </div>
            <div className={`${styles.contentsWrapper}`}>
                <p>{contents}</p>
            </div>
            {visibleComment && (
                <CommentList />
            )}
        </div>
    );
};

export default Feed;