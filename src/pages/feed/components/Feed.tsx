import React from 'react';
import styles from "../css/Feed.module.css";
import { Container } from 'react-bootstrap';

interface FeedProps {
    author: string;
    img: string;
    contents: string;
}

const Feed: React.FC<FeedProps> = ({ author, img, contents }) => {
    return (
        <Container className={`${styles.container}`} >
            <h2>{author}</h2>
            <div className={`${styles.feedImg}`}>
                <img src={img} alt={author} />
            </div>
            {/* 댓글 갯수 */}
            {/* 조회수 */}
            {/* 좋아요 */}
            {/* 1일전(쓴 시간) */}
            <div className={`${styles.contentsWrapper}`}>
                <p>{contents}</p>
            </div>
        </Container>
    );
};

export default Feed;