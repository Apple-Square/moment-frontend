import { useState } from "react";
import styles from "../css/AddComment.module.css";
import { Col, Container, Row } from "react-bootstrap";

const AddComment = () => {
    const [text, setText] = useState("");

    return (
        <Container className={styles.container}>
            <Row>
                <Col lg={10} sm={12} className="p-1">
                    <div className={styles.commentInput}>
                        <textarea
                            placeholder="내용을 입력하세요."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                </Col>
                <Col className="p-1">
                    <button className={styles.submitBtn}>등록</button>
                </Col>
            </Row>
        </Container>
    );
}

export default AddComment;