import { Dispatch, SetStateAction, useContext, useState } from "react";
import styles from "../css/AddComment.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { updateCommentRequest } from "../function/commentAxiosReqest";
import { CommentMenuContext } from "../../../context/CommentMenuContext";

// overide AddComment
interface UpdateCommentProps {
    commentId: number | null;
    originText: string;
    fetchComment: () => {};
    setIsEdited: (Dispatch<SetStateAction<boolean>>);
}

const UpdateComment: React.FC<UpdateCommentProps> = ({ commentId, originText, fetchComment, setIsEdited }) => {
    const [text, setText] = useState(originText);
    const { setTargetComment } = useContext(CommentMenuContext);

    const handlePublish = () => {
        if (commentId) {
            if (text && text !== originText) {
                updateCommentRequest(commentId, text)
                    .then(response => {
                        if ('data' in response) {
                            console.log('댓글 작성 성공:', response.data);
                            setText('');
                            setIsEdited(false);
                            setTargetComment(null);
                            fetchComment();
                        }
                    })
                    .catch(error => {
                        console.error('댓글 작성 실패:', error);
                    });

                console.log('Text:', text);
            } else if (!text) {
                alert('내용을 입력해주세요.');
            } else {
                console.error('수정된 내용 없음');
                setIsEdited(false);
                setTargetComment(null);
            }
        } else {
            console.error(`Invalid commentId {${commentId}}`);
        }
    }

    return (
        <Container className={`${styles.container} px-0`}>
            <Row>
                <Col xs={10} className="px-0">
                    <div className={styles.commentInput}>
                        <textarea
                            placeholder="내용을 입력하세요."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                </Col>
                <Col xs={2} className="px-2 text-center">
                    <button className={`${styles.submitBtn}`} onClick={handlePublish}>게시</button>
                </Col>
            </Row>
        </Container >
    );
}

export default UpdateComment;