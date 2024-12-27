import React, { useEffect, useState } from 'react';
import FeedList from './components/FeedList';
import styles from "./css/MainFeed.module.css";
import { Col, Container, Row } from "react-bootstrap";
import TitleHeader from '../common/components/TitleHeader';
import { Footer } from '../common/components/Footer';
import CommentModal from './components/CommentModal';
// import NaviBar from '../common/components/NaviBar';
import { CommentModalContext } from '../../context/CommentModalContext';
import { FeedMenuContext } from '../../context/FeedMenuContext';

const MainFeed: React.FC = () => {
    const [commentOpen, setCommentOpen] = useState<boolean>(false);
    const [feedMenuOpen, setFeedMenuOpen] = useState<boolean>(false)

    // modal 오픈 시 main scroll lock
    useEffect(() => {
        if (commentOpen || feedMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [commentOpen, feedMenuOpen]);

    return (
        <Container className={`${styles.container} px-0`}>
            <Row className={`${styles.headerRow} p-0 m-0`}>
                <Col className='p-0'>
                    <TitleHeader />
                </Col>
            </Row>
            <Row className={`${styles.viewer} px-0 mx-0`}>
                <Col className='p-0'>
                    <CommentModalContext.Provider value={{ commentOpen, setCommentOpen }}>
                        <FeedMenuContext.Provider value={{ feedMenuOpen, setFeedMenuOpen }}>
                            <FeedList />
                        </FeedMenuContext.Provider>
                    </CommentModalContext.Provider>
                </Col>
            </Row>
            <Row className={`${styles.cmodalRow} p-0 m-0`}>
                <Col className='p-0'>
                    <CommentModalContext.Provider value={{ commentOpen, setCommentOpen }}>
                        <CommentModal id={0} /> {/* dummy id */}
                    </CommentModalContext.Provider>
                </Col>
            </Row>
            <Row className={`${styles.navRow} p-0 m-0`}>
                <Col className='p-0'>
                    {/* <NaviBar /> */}
                    <Footer />
                </Col>
            </Row>
        </Container>
    );
};

export default MainFeed;