import { useState } from "react";
import styles from "../css/AddComment.module.css";
import { Col, Container, Row } from "react-bootstrap";

const AddComment = () => {
    const [text, setText] = useState("");

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
                    <button className={`${styles.submitBtn}`}>게시</button>
                </Col>
            </Row>
        </Container>
    );
}

export default AddComment;