import React from "react";
import Feed from "./components/Feed";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./css/FeedDetail.module.css";

const dummy = {
    profileImg: 'https://randomuser.me/api/portraits/men/1.jpg',
    author: 'John Doe',
    location: 'New York, USA',
    images: ['https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0'],
    contents: 'Exploring the beautiful streets of New York City!',
    likes: 120,
    comments: 24,
    shares: 15,
    timeAgo: '2 hours ago'
}

const FeedDetail: React.FC = () => {

    return (
        <Container className={`${styles.container} p-0`}>
            <Row className={`${styles.feedRow} px-0`}>
                <Col /*xs={12} md={8} lg={4}*/ className='p-0'>
                    <Feed
                        profileImg={dummy.profileImg}
                        author={dummy.author}
                        location={dummy.location}
                        images={dummy.images}
                        contents={dummy.contents}
                        likes={dummy.likes}
                        comments={dummy.comments}
                        shares={dummy.shares}
                        timeAgo={dummy.timeAgo}
                    />
                </Col>
            </Row>
        </Container>

    );
}

export default FeedDetail;