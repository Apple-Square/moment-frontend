import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/ThumbnailFeed.module.css';

interface ThumbnailFeedProps {
    img: string;
    likes: number;
    comments: number;
    shares: number;
}

const ThumbnailFeed: React.FC<ThumbnailFeedProps> = ({ img, likes, comments, shares }) => {
    const navi = useNavigate();

    const handleClickThumbnail = () => {
        // getPoint
        // goto detailPost
        navi('/moment'); // navi point
    }

    return (
        <div className={styles.thumbFeedContainer}>
            <div className={styles.imageContainer} onClick={handleClickThumbnail}>
                <img className={styles.thumbnailImg} src={img} alt="thumbnail" />
            </div>
            <div className={styles.hoverBar}>
                <span className={styles.hoverItem}>👍 {likes}</span>
                <span className={styles.hoverItem}>💬 {comments}</span>
                <span className={styles.hoverItem}>🔄 {shares}</span>
            </div>
        </div>
    );
};

export default ThumbnailFeed;