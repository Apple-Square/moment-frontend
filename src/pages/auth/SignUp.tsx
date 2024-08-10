import React from "react";
import {Form, Col, Container, Row} from "react-bootstrap";
import st from "./css/signUp.module.css"
export const SignUp:React.FC = () => {
    return (
        <Container className={`${st.container}`}>
            <Row className={`w-100 mb-4 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control type="text" placeholder="닉네임"
                                className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex justify-content-center">
                    <Form.Control type="text" placeholder="아이디"
                                className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            뿅
        </Container>
    );
};
