import React, { useState } from 'react';
import styles from "../css/Feed.module.css";
import CommentList from './CommentList';
// import { Col, Container, Row } from 'react-bootstrap';

interface FeedProps {
    // user 객체
    profileImg: string
    author: string;
    //
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

    const handleClickComment = () => {
        setVisibleComment(!visibleComment);
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
            {visibleComment && (
                <CommentList />
            )}
        </div>
    );
};

export default Feed;