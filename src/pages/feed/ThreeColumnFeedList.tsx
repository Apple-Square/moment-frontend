import { Col, Container, Row } from "react-bootstrap";
import ThumbnailFeedList from "./components/ThumbnailFeedList";
import styles from './css/ThreeColumnFeedList.module.css';
import TitleHeader from "../common/components/TitleHeader";

const ThreeColumnFeedList = () => {
    return (
        <Container className={`${styles.container} px-0`}>
            <Row className={`${styles.headerRow} p-0 m-0`}>
                <Col className='p-0'>
                    <TitleHeader />
                </Col>
            </Row>
            <Row className='p-0'>
                <Col className='p-0'>
                    <ThumbnailFeedList />
                </Col>
            </Row>
        </Container>
    );
};

export default ThreeColumnFeedList;