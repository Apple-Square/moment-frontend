import React from 'react';
import FeedList from './components/FeedList';
import styles from "./css/MainFeed.module.css";
import { Col, Container, Row } from "react-bootstrap";
import TitleHeader from '../common/components/TitleHeader';
import NaviBar from '../common/components/NaviBar';

const MainFeed: React.FC = () => {
    return (
        <Container className={`${styles.container} px-0`}>
            <Row className={`${styles.headerRow} p-0 m-0`}>
                <Col xs={12} md={8} lg={4} className='p-0'>
                    <TitleHeader />
                </Col>
            </Row>
            <Row className={`${styles.viewer} px-0 mx-0`}>
                <Col xs={12} md={8} lg={4} className='p-0'>
                    <FeedList />
                </Col>
            </Row>
            <Row className={`${styles.navRow} p-0 m-0`}>
                <Col xs={12} md={8} lg={4} className='p-0'>
                    <NaviBar />
                </Col>
            </Row>
        </Container>
    );
};

export default MainFeed;