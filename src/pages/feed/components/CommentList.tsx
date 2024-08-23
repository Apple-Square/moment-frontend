import { Col, Container, Row } from "react-bootstrap";
import styles from "../css/CommentList.module.css";
import Comment from "./Comment";

const commentData = [
    {
        profileImg: "https://via.placeholder.com/50",
        author: "John Doe",
        contents: "This is a sample comment. It provides an example of how a comment might look in the UI."
    },
    {
        profileImg: "https://via.placeholder.com/50",
        author: "Jane Smith",
        contents: "I really enjoyed reading this post. Looking forward to more content like this!"
    },
    {
        profileImg: "https://via.placeholder.com/50",
        author: "Alice Johnson",
        contents: "Great insights! I hadn't thought about this topic in that way before."
    },
    {
        profileImg: "https://via.placeholder.com/50",
        author: "Bob Brown",
        contents: "Thanks for sharing this information. It was very helpful and informative."
    },
    {
        profileImg: "https://via.placeholder.com/50",
        author: "Charlie Davis",
        contents: "I appreciate the effort you put into writing this. Keep up the good work!"
    }
];

const CommentList = () => {
    return (
        <Container className={`${styles.container} p-0`}>
            {commentData.map((comment, index) => (
                <Row key={index} className={`${styles.commentRow} mb-3 px-0`}>
                    <Col className='p-0'>
                        <Comment
                            profileImg={comment.profileImg}
                            author={comment.author}
                            contents={comment.contents}
                        />
                    </Col>
                </Row>
            ))}
        </Container>
    )
}

export default CommentList;