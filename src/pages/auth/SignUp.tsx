import React from "react";
import {Form, Col, Container, Row, Button} from "react-bootstrap";
import st from "./css/signUp.module.css"
import MomentLogoNTextImg from "./component/MomentLogoNTextImg.tsx";
import {IoMdArrowRoundBack} from "react-icons/io";
export const SignUp:React.FC = () => {
    return (
        <Container className={`${st.container}`}>
            <Row className="d-flex justify-content-between align-items-center w-100 mb-4">
                <Col xs="auto" style={{height:"auto"}}>
                    <div
                        className={`${st.backButton}`}
                        onClick={() => window.history.back()}>
                        <IoMdArrowRoundBack size={32}/>
                    </div>
                </Col>
                <Col xs="auto" style={{maxWidth:"80px"}}>
                    <MomentLogoNTextImg />
                </Col>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control type="text" placeholder="닉네임"
                                  className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control type="text" placeholder="아이디"
                                className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control type="text" placeholder="비밀번호"
                                  className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control type="text" placeholder="비밀번호 재입력"
                                  className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control type="text" placeholder="생년월일 이거는 datePicker"
                                  className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control type="text" placeholder="성별 이거도 선택으로"
                                  className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control type="text" placeholder="이메일 이거 입력 바꾸기 @와 선택으로"
                                  className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control type="text" placeholder="주소지 얘 주소라이브러리"
                                  className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row className={`w-100 ${st.h8}`}  style={{minWidth: "300px"}}>
                <Col className="d-flex justify-content-center">
                    <Button className={`w-100 ${st.h100} ${st.borderRadius} ${st.loginButton}`}>회원가입 하기</Button>
                </Col>
            </Row>

        </Container>
    );
};
