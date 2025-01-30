import React, { useContext, useState } from "react";
import styles from "../css/Comment.module.css";
import SvgLike from "./SvgLike";
import SvgCommentMenu from "./SvgCommentMenu";
import { CommentMenuContext } from "../../../context/CommentMenuContext";
import UpdateComment from "./UpdateComment";
import { deleteCommentRequest } from "../function/commentAxiosReqest";

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
    fetchComment?: () => any;
    deleteComment: (id: number) => any;
}

const Comment: React.FC<CommentProps> = ({
    id,
    regDate,
    content,
    writer,
    likeCount,
    liked,
    onClick = () => { },
    fetchComment = () => { },
    deleteComment
}) => {
    const [likedState, setLikedState] = useState(liked);
    const [isEdited, setIsEdited] = useState(false);
    const { commentMenuOpen, setCommentMenuOpen } = useContext(CommentMenuContext)

    const handleClickLike = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation();
        setLikedState(!likedState);
        // post like (likedState ? 1 : -1)
        // get like
    }

    const handleCLickCommentMenu = () => {
        setCommentMenuOpen(!commentMenuOpen);
    }

    const handleClickUpdateComment = () => {
        setIsEdited(true);
    }

    const handleClickDeleteComment = () => {
        deleteComment(id);
        setCommentMenuOpen(false);
    }

    return (
        <>
            {(!isEdited) ? (<div className={styles.container} onClick={onClick}>
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
                </div>
                <div className={styles.footer}>
                    <span className={styles.regDate}>{regDate}</span>
                    <span className={styles.menu} onClick={handleCLickCommentMenu}> {/* hover시 icon 나타나게 해야 할 듯 */}
                        <SvgCommentMenu
                            className={styles.menuBtn}
                            size={20}
                        />
                    </span>
                </div>
                {commentMenuOpen && (
                    <div className={`${styles.commentMenu} p-2`}>
                        <ul>
                            <li onClick={handleClickUpdateComment}>댓글 수정</li>
                            <li onClick={handleClickDeleteComment}>댓글 삭제</li>
                        </ul>
                    </div>)}
            </div>) : (
                <UpdateComment commentId={id} originText={content} fetchComment={fetchComment} setIsEdited={setIsEdited} />
            )}
        </>

    );
}

export default Comment;