import { Col, Container, Row } from "react-bootstrap";
import styles from "../css/CommentList.module.css";
import Comment from "./Comment";
import AddComment from "./AddComment";
import { tempCommentData } from "../temp/tempData";
import { useEffect, useState } from "react";
import { getCommentRequest } from "../function/commentAxiosReqest";

interface CommentListProps {
    target: number | null;
}

const CommentList: React.FC<CommentListProps> = ({ target }) => {
    const [commentData, setCommentData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const response = await getCommentRequest(target);
            if ('data' in response) { // AxiosResponse인지 확인
                setCommentData(response.data.content);
            } else {
                console.error('Error fetching comments:', response);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setIsLoading(false); // 로딩 상태 해제
        }
    };
    
    const deleteComment = async (id) => {
            try {
                // const response = await deleteFeedRequest(id);
                setCommentData(p => p.filter(feed => feed.id !== id));
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        };

    useEffect(() => {
        fetchComments();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // 로딩 스피너 또는 메시지 표시
    }

    return (
        <>
            <AddComment postId={target} fetchComment={fetchComments}/>
            <Container className={`${styles.container} p-0`}>
                {commentData.map((comment, index) => (
                    <Row key={index} className={`${styles.commentRow} mb-3 px-0`}>
                        <Col className='p-0'>
                            <Comment
                                id={comment.id}
                                regDate={comment.regDate}
                                content={comment.content}
                                writer={comment.writer}
                                likeCount={comment.likeCount}
                                liked={comment.liked}
                            />
                        </Col>
                    </Row>
                ))}
            </Container>
        </>
    )
}

export default CommentList;