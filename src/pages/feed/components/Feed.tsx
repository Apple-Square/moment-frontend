import React, { useContext, useEffect, useState } from 'react';
import styles from "../css/Feed.module.css";
// import CommentList from './CommentList';
import Comment from './Comment';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
// import SwiperCore from 'swiper';
import 'swiper/css';
import SvgLike from './SvgLike';
import { CommentModalContext } from '../../../context/CommentModalContext';
// import { Col, Container, Row } from 'react-bootstrap';
import { trandingComment } from '../temp/tempData';

interface FeedProps {
    id: number;
    regDate: string;
    content: string;
    writer: {
        id: string;
        nickname: string;
        profileImage: string;
    };
    tags: string[];
    mediaType: "IMAGE" | "VIDEO";
    urls: string[];
    address: string;
    x: number;
    y: number;
    viewCount: number;
    commentCount: number;
    likeCount: number;
    liked: boolean;
    commented: boolean;
}

const Feed: React.FC<FeedProps> = ({
    id,
    regDate,
    content,
    writer,
    tags,
    mediaType,
    urls,
    address,
    x,
    y,
    viewCount,
    commentCount,
    likeCount,
    liked,
    commented
}) => {
    // const [visibleComment, setVisibleComment] = useState<boolean>(false);
    // const [slidePosition, setSlidePosition] = useState<number>(0);
    const { commentOpen, setCommentOpen } = useContext(CommentModalContext);
    const [likedState, setLikedState] = useState<boolean>(liked);

    const navi = useNavigate();
    // const locationPath = useLocation();
    const pagination = {
        clickable: false,
        renderBullet: function (index: number, className: string) {
            return `<span class="${className}"></span>`;
        },
    };

    const handleClickComment = () => {
        setCommentOpen(true);
        // setVisibleComment(!visibleComment);
        // navi('/feed/FeedDetail');   // navi point
    }

    const handleClickLike = () => {
        setLikedState(!likedState);
        // post like (liked ? 1 : -1)
        // get like
    }

    const castTime = (isoString: string): string => {
        const time = new Date(isoString).getTime();
        const now = Date.now();
        const diff = now - time;
    
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const month = Math.floor(days / 30);
        const year = Math.floor(days / 365);

    
        if (seconds < 60) return `${seconds}초 전`;
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        if (weeks < 5) return `${weeks}주 전`;
        if (month < 12) return `${month}달 전`;
        return `${year}년 전`;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={`${styles.profile} p-2`}>
                    <img className={styles.profileImg} src={writer.profileImage} alt="Profile" />
                    <div className={styles.authorInfo}>
                        <span className={styles.author}>{writer.nickname}</span>
                        <span className={styles.location}>{address}</span>
                    </div>
                </div>
            </div>
            <div className={styles.imageContainer}>
                {/* <img className={styles.contentImg} src={img} alt="contents" /> */}
                <Swiper
                    className={styles.imgSlide}
                    style={{ position: 'absolute' }} // css bug point
                    pagination={pagination}
                    modules={[Pagination]}
                    slidesPerView={1}
                    onSwiper={(swiper) => {
                        console.log(swiper);
                    }}
                >
                    {urls.map((url, index) => (
                        <SwiperSlide key={index}>
                            <img className={styles.contentImg} src={url} alt={`Content${index}`}/>
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>
            <div className={`${styles.actions} px-1`}>
                <span className={styles.likes}>
                    <SvgLike
                        className={styles.likeBtn}
                        onClick={handleClickLike}
                        style={{ "width": "1rem", "height": "auto", "cursor": "pointer" }}
                        fill={likedState ? "blue" : "black"}
                    />
                    {likeCount}
                </span>
                <span className={styles.comments} onClick={handleClickComment} style={{"cursor": "pointer"}}>💬 {commentCount}</span>
                <span className={styles.shares}>👀 {viewCount}</span>
                <span className={styles.timeAgo}>{castTime(regDate)}</span>
            </div>
            <div className={`${styles.contentsWrapper}`}>
                <p>{content}</p>
            </div>
            <div>
                <Comment
                    profileImg={trandingComment.profileImg}
                    author={trandingComment.author}
                    likes={trandingComment.likes}
                    contents={trandingComment.contents}
                    onClick={handleClickComment}
                />
            </div>

        </div>
    );
};

export default Feed;