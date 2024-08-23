import React, { useState } from 'react';
import styles from "../css/Feed.module.css";
import Comment from './Comment';
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


const dummyComment = {      // comment test
    profileImg: "https://via.placeholder.com/50", // Placeholder 이미지 URL
    author: "John Doe",
    contents: "This is a sample comment. It provides an example of how a comment might look in the UI."
};

const Feed: React.FC<FeedProps> = ({ profileImg, author, location, img, contents, likes, comments, shares, timeAgo }) => {
    const [visibleComment, setVisibleComment] = useState<boolean>(false);

    const handleClickComment = () => {
        setVisibleComment(true);
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
                <Comment
                    profileImg={dummyComment.profileImg}
                    author={dummyComment.author}
                    contents={dummyComment.contents}
                />
            )}
        </div>
    );
};

export default Feed;