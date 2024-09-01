import { Col, Container, Row } from "react-bootstrap";
import ThumbnailFeedList from "./components/ThumbnailFeedList";
import styles from './css/ThreeColumnFeedList.module.css';

const ThreeColumnFeedList = () => {
    return (
        <Container className={`${styles.container} p-0`}>
            <Row className='p-0'>
                <Col xs={12} md={8} lg={8} className='p-0'>
                    <ThumbnailFeedList />
                </Col>
            </Row>

        </Container>
    );
};

export default ThreeColumnFeedList;