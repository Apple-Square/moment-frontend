import React, { useContext, useState } from "react";
import styles from "../css/CommentModal.module.css"
import CommentList from "./CommentList";
import { CommentModalContext } from "../../../context/CommentModalContext";

interface CommentModalProps {
    id: number;
}

const CommentModal: React.FC<CommentModalProps> = ({ id }) => {
    const { commentOpen, setCommentOpen } = useContext(CommentModalContext);
    const [slidePosition, setSlidePosition] = useState<number>(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        setSlidePosition(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const newPosition = e.touches[0].clientY;
        if (newPosition < slidePosition) {
            setCommentOpen(true); // 위로 끌어올리면 댓글 표시
        }

        if (newPosition > slidePosition) {
            setCommentOpen(false);
        }
    };

    // 마우스 클릭 및 드래그 시작 이벤트 핸들러 (PC)
    const handleMouseDown = (e: React.MouseEvent) => {
        setSlidePosition(e.clientY);
    };

    // 마우스 움직임 이벤트 핸들러 (PC)
    const handleMouseMove = (e: React.MouseEvent) => {
        if (e.buttons === 1) {  // 왼쪽 마우스 버튼이 눌렸을 때만 처리
            const newPosition = e.clientY;
            if (newPosition < slidePosition) {
                setCommentOpen(true);  // 위로 드래그하면 댓글 표시
            }

            if (newPosition > slidePosition) {
                setCommentOpen(false);
            }
        }
    };

    return (
        <div className={`${styles.commentModal} ${commentOpen ? styles.open : ''}`}>
            <div className={styles.bar}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            >
                <div className={styles.barHr} />
            </div>
            {commentOpen && <CommentList />} {/* get with id */}
        </div>
    );
}

export default CommentModal;