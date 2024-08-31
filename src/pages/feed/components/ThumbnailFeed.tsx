import React from 'react';
import styles from '../css/ThumbnailFeed.module.css';

interface ThumbnailFeedProps {
    img: string;
    likes: number;
    comments: number;
    shares: number;
}

const ThumbnailFeed: React.FC<ThumbnailFeedProps> = ({ img, likes, comments, shares }) => {

    return (
        <div className={styles.thumbFeedContainer}>
            <div className={styles.imageContainer}>
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