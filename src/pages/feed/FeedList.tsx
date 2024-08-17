import React from 'react';
import Feed from './components/Feed';
import styles from "./css/FeedList.module.css";
import { Container } from "react-bootstrap";


const FeedList: React.FC = () => {
    return (
        <Container className={`${styles.container}`}>
            <Feed
                author='홍길동'
                img=''
                contents='테스트다!'
            />
        </Container>

    );
};

export default FeedList;