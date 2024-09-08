import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {FaHome, FaComments, FaUser, FaPlus, FaVideo} from "react-icons/fa";
import st from "../css/footer.module.css";
export const Footer:React.FC = () => {

    return (
        <footer id="footer" className={`${st.footer}`}>
            <Container fluid>
                <Row>
                   <Col>
                       <Link to="/">
                           <FaHome style={{ fontSize: '4vh'}}/>
                       </Link>
                   </Col>
                    <Col>
                        <Link to="/chat/chatroomList">
                            <FaComments style={{ fontSize: '4vh'}}/>
                        </Link>
                    </Col>
                    <Col>
                        <Link to="/feed/addFeed">
                            <FaPlus style={{ fontSize: '4vh'}}/>
                        </Link>
                    </Col>
                    <Col>
                        <Link to="/feed/threeColumnFeedList">
                            <FaVideo style={{ fontSize: '4vh'}}/>
                        </Link>
                    </Col>
                    <Col>
                        <Link to="/user/profile">
                            <FaUser style={{ fontSize: '4vh'}}/>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    );

};