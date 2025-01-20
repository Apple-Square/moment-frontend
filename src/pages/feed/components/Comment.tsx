import React, { useState } from "react";
import styles from "../css/Comment.module.css";
import SvgLike from "./SvgLike";

interface UserProfile {
    id: string;
    nickname: string;
    profileImage: string;
}

interface CommentProps {
    id: number;
    regDate: string;
    content: string;
    writer: UserProfile;
    likeCount: number;
    liked: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Comment: React.FC<CommentProps> = ({
    id,
    regDate,
    content,
    writer,
    likeCount,
    liked,
    onClick = () => { }
}) => {
    const [likedState, setLikedState] = useState(liked);

    const handleClickLike = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation();
        setLikedState(!likedState);
        // post like (likedState ? 1 : -1)
        // get like
    }

    return (
        <div className={styles.container} onClick={onClick}>
            <div className={styles.header}>
                {/* UserProfile */}
                <div className={`${styles.profile} px-2 py-1`}>
                    <img
                        className={styles.profileImg}
                        src={writer.profileImage}
                        alt={`${writer.nickname}'s profile`}
                    />
                    <span className={styles.author}>{writer.nickname}</span>
                </div>
                
                <div className={styles.action}>
                    <span className={styles.likes}>
                        <SvgLike
                            className={styles.likeBtn}
                            onClick={handleClickLike}
                            style={{ width: "1rem", height: "auto" }}
                            fill={likedState ? "blue" : "black"}
                        />
                        {likeCount}
                    </span>
                </div>
            </div>
            <div className={styles.contentsWrapper}>
                <p>{content}</p>
                <span className={styles.regDate}>{regDate}</span>
            </div>
        </div>
    );
}

export default Comment;