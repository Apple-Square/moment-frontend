import { Col, Container, Row } from "react-bootstrap"
import TitleHeader from "../common/components/TitleHeader";
import MomentList from "./components/MomentList";
import { CommentModalContext } from "../../context/CommentModalContext";
import { Footer } from "../common/components/Footer";
import CommentModal from "./components/CommentModal";
import styles from "./css/MomentScroll.module.css";

const MomentScroll = () => {

    return (
        <Container className={`${styles.container} px-0`}>
            {/* <Row className={`${styles.headerRow} p-0 m-0`}>
                <Col className='p-0'>
                    <TitleHeader />
                </Col>
            </Row> */}
            <Row className={`${styles.viewer} px-0 mx-0`}>
                <Col className='p-0'>
                    {/* <CommentModalContext.Provider value={}> */}
                        <MomentList />
                    {/* </CommentModalContext.Provider> */}
                </Col>
            </Row>
            <Row className={`${styles.cmodalRow} p-0 m-0`}>
                <Col className='p-0'>
                    {/* <CommentModalContext.Provider value={}> */}
                        <CommentModal id={0} /> {/* dummy id */}
                    {/* </CommentModalContext.Provider> */}
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
}

export default MomentScroll;