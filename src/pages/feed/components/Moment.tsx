import React from "react";
import styles from "../css/Moment.module.css";
import SvgLike from "./SvgLike";

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
                        // onClick={ /* handleClickLike */ }
                        style={{ "width": "2rem", "height": "auto" }}
                        // fill={/*liked ? "blue" : "black"*/}
                    />
                    <span className={styles.likes}>{likes}</span>
                </div>
                <div className={`${styles.action}`}>
                    <span
                        style={{fontSize: "1.5rem"}}
                    >💬</span>
                    <span className={styles.comments} /* onClick={  handleClickComment } */ > {comments}</span>
                </div>
                <div className={`${styles.action}`}>
                    <span
                        style={{fontSize: "2rem"}}
                    >
                    ↗️
                    </span>
                    <span className={styles.shares}>{shares}</span>
                </div>
            </div>
            <div>
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

export default Moment