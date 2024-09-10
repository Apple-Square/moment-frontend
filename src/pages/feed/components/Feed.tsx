import React, { useEffect, useState } from 'react';
import styles from "../css/Feed.module.css";
import CommentList from './CommentList';
import Comment from './Comment';
import { useNavigate, useLocation } from 'react-router-dom';
// import { Col, Container, Row } from 'react-bootstrap';

// dummy
const trandingComment = {
    profileImg: "https://via.placeholder.com/50",
    author: "John Doe",
    contents: "This is a sample comment. It provides an example of how a comment might look in the UI."
}

interface FeedProps {
    profileImg: string
    author: string;
    location: string;
    img: string;
    contents: string;
    likes: number;
    comments: number;
    shares: number;
    timeAgo: string;
}

const Feed: React.FC<FeedProps> = ({ profileImg, author, location, img, contents, likes, comments, shares, timeAgo }) => {
    const [visibleComment, setVisibleComment] = useState<boolean>(false);
    const [slidePosition, setSlidePosition] = useState<number>(0);
    const navi = useNavigate();
    const locationPath = useLocation();

    // useEffect(() => {
    //     if (locationPath.pathname === '/feed/FeedDetail') {
    //         setVisibleComment(true);
    //     } else {
    //         setVisibleComment(false);
    //     }
    // }, [locationPath]);

    const handleClickComment = () => {
        // setVisibleComment(!visibleComment);
        navi('/feed/FeedDetail');   // navi point
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        setSlidePosition(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const newPosition = e.touches[0].clientY;
        if (newPosition < slidePosition) {
            setVisibleComment(true); // 위로 끌어올리면 댓글 표시
        }

        if (newPosition > slidePosition) {
            setVisibleComment(false);
        }
    };

    // 마우스 클릭 및 드래그 시작 이벤트 핸들러 (PC)
    const handleMouseDown = (e: React.MouseEvent) => {
        setSlidePosition(e.clientY);
    };

    // 마우스 움직임 이벤트 핸들러 (PC)
    const handleMouseMove = (e: React.MouseEvent) => {
        if (e.buttons === 1) {  // 왼쪽 마우스 버튼이 눌렸을 때만 처리
            const newPosition = e.clientY;
            if (newPosition < slidePosition) {
                setVisibleComment(true);  // 위로 드래그하면 댓글 표시
            }

            if (newPosition > slidePosition) {
                setVisibleComment(false);
            }
        }
    };

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
                <img className={styles.contentImg} src={img} alt="contents" />
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
            <div>
                <Comment 
                    profileImg={trandingComment.profileImg} 
                    author={trandingComment.author}
                    contents={trandingComment.contents}
                />
            </div>

            <div
                className={`${styles.commentModal} ${visibleComment ? styles.open : ''}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            >
                <div className={styles.bar}></div> {/* 끌어올릴 바 */}
                {visibleComment && <CommentList />}
            </div>
        </div>
    );
};

export default Feed;