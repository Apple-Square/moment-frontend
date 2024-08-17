import React from 'react';
import Feed from './components/Feed';
import styles from "./css/FeedList.module.css";
import { Col, Container, Row } from "react-bootstrap";


const FeedList: React.FC = () => {
    return (
        <Container className={`${styles.container}`}>
            <Row>
                <Col>
                    <Feed
                        profileImg=''
                        author='홍길동'
                        location='서울 용산구'
                        img=''
                        contents='테스트다!'
                        likes={0}
                        comments={0}
                        shares={0}
                        timeAgo='0시간 전'
                    />
                </Col>
            </Row>
        </Container>

    );
};

export default FeedList;