import { useState } from "react";
import styles from "../css/AddComment.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { createCommentRequest } from "../function/commentAxiosReqest";

interface AddFeedProps {
    postId: number | null;
    fetchComment: () => {};
}

const AddComment: React.FC<AddFeedProps> = ({ postId, fetchComment }) => {
    const [text, setText] = useState("");

    const handlePublish = () => {
        if (postId) {
            if (text) {
                createCommentRequest(postId, text)
                    .then(response => {
                        if ('data' in response) {
                            console.log('댓글 작성 성공:', response.data);
                            setText('');
                            fetchComment()
                        }
                    })
                    .catch(error => {
                        console.error('댓글 작성 실패:', error);
                    });

                console.log('Text:', text);
            } else {
                alert('내용을 입력해주세요.');
            }
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

export default AddComment;