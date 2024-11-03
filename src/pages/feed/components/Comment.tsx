import React, { useState } from "react";
import styles from "../css/Comment.module.css";
import SvgLike from "./SvgLike";

interface CommentProps {
    // user 객체
    profileImg: string
    author: string;
    //
    likes: number;
    contents: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Comment: React.FC<CommentProps> = ({ profileImg, author, likes, contents, onClick = () => { } }) => {
    const [liked, setLiked] = useState(false);

    const handleClickLike = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation();
        setLiked(!liked);
        // post like (liked ? 1 : -1)
        // get like
    }

    return (
        <div className={styles.container} onClick={onClick}>
            <div className={styles.header}>
                <div className={`${styles.profile} px-2 py-1`}>
                    <img className={styles.profileImg} src={profileImg} alt="Profile" />
                    <span className={styles.author}>{author}</span>
                </div>
                <div className={`${styles.action}`}>
                    <span className={styles.likes}>
                        <SvgLike
                            className={styles.likeBtn}
                            onClick={handleClickLike}
                            style={{ "width": "1rem", "height": "auto" }}
                            fill={liked ? "blue" : "black"}
                        />
                        {likes}
                    </span>
                </div>
            </div>
            <div className={`${styles.contentsWrapper}`}>
                <p>{contents}</p>
            </div>

        </div>
    );
}

export default Comment;