import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {FaHome, FaUser, FaPlus, FaVideo} from "react-icons/fa";
import st from "../css/footer.module.css";
import SvgSearch from './SvgSearch';

export const Footer:React.FC = () => {
    return (
        <footer id="footer" className={`${st.footer} d-flex justify-content-center align-items-center`}>
            <Container fluid>
                <Row>
                   <Col style={styles.columnStyle}>
                       <Link to="/">
                           <FaHome className={st.footerIcon}/>
                       </Link>
                   </Col>
                    <Col style={styles.columnStyle}>
                        <Link to="/feed/threeColumnFeedList">
                            <SvgSearch className={`${st.footerIcon} ${st.searchBtn}`} />
                        </Link>
                    </Col>
                    <Col style={styles.columnStyle}>
                        <Link to="/feed/addFeed">
                            <FaPlus className={st.footerIcon}/>
                        </Link>
                    </Col>
                    <Col style={styles.columnStyle}>
                        <Link to="/moment">
                            <FaVideo className={st.footerIcon}/>
                        </Link>
                    </Col>
                    <Col style={styles.columnStyle}>
                        <Link to="/user/profile">
                            <FaUser className={st.footerIcon}/>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

const styles : {[key : string] : React.CSSProperties} = {
    columnStyle : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}