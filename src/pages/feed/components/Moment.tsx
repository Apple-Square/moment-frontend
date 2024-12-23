import React, { useContext, useState } from "react";
import styles from "../css/Moment.module.css";
import SvgLike from "./SvgLike";
import { CommentModalContext } from "../../../context/CommentModalContext";

interface MomentProps {
    profileImg: string;
    author: string;
    location: string;
    src: string;
    contents: string;
    likes: number;
    comments: number;
    shares: number;
    timeAgo: string;
}

const Moment: React.FC<MomentProps> = ({ profileImg, author, location, src, contents, likes, comments, shares, timeAgo }) => {
    const [liked, setLiked] = useState<boolean>(false);
    const { commentOpen, setCommentOpen } = useContext(CommentModalContext);

    const handleClickComment = () => {
        setCommentOpen(true);
        // setVisibleComment(!visibleComment);
        // navi('/feed/FeedDetail');   // navi point
    }

    const handleClickLike = () => {
        setLiked(!liked);
        // post like (liked ? 1 : -1)
        // get like
    }

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.videoRow}`}>
                <video src={src} muted autoPlay playsInline></video>
            </div>
            <div className={`${styles.anpContainer} p-2`}>
                <div className={`${styles.profileRow}`}>
                    <div className={`${styles.profile}`}>
                        <img className={styles.profileImg} src={profileImg} alt="Profile" />
                        <div className={styles.authorInfo}>
                            <span className={styles.author}>{author}</span>
                            <span className={styles.location}>{location}</span>
                        </div>
                    </div>
                </div>
                <div className={`${styles.contentsRow}`}>
                    <p>{contents}</p>
                </div>
            </div>
            <div className={`${styles.actions}`}>
                <div className={`${styles.action}`}>
                    <SvgLike
                        className={styles.likeBtn}
                        onClick={handleClickLike}
                        style={{ "width": "2rem", "height": "auto" }}
                        fill={liked ? "blue" : "black"}
                    />
                    <span className={styles.likes}>{likes}</span>
                </div>
                <div className={`${styles.action}`}>
                    <span
                        className={styles.commentBtn}
                        onClick={handleClickComment}
                        style={{ fontSize: "1.5rem" }}
                    >💬</span>
                    <span className={styles.comments}> {comments}</span>
                </div>
                <div className={`${styles.action}`}>
                    <span
                        style={{ fontSize: "2rem" }}
                    >
                        ↗️
                    </span>
                    <span className={styles.shares}>{shares}</span>
                </div>
            </div>
            <div>
                {/* 인기 댓글 하나 */}
                {/* <Comment 
                    profileImg={trandingComment.profileImg} 
                    author={trandingComment.author}
                    likes={trandingComment.likes}
                    contents={trandingComment.contents}
                    onClick={handleClickComment}
                /> */}

            </div>

        </div>
    );
}


export default Moment;