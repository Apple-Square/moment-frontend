import React from "react";
import styles from "../css/Comment.module.css";

interface CommentProps {
    // user 객체
    profileImg: string
    author: string;
    //
    contents: string;
}

const Comment: React.FC<CommentProps> = ({ profileImg, author, contents }) => {

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={`${styles.profile} px-2 py-1`}>
                    <img className={styles.profileImg} src={profileImg} alt="Profile" />
                    <span className={styles.author}>{author}</span>
                </div>
            </div>
            <div className={`${styles.contentsWrapper}`}>
                <p>{contents}</p>
            </div>

        </div>
    );
}

export default Comment;