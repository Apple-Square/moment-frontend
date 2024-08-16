import React from 'react';
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import st from "./css/signUp.module.css";
import {useNavigate} from "react-router-dom";

const EmailVerification:React.FC = () => {

    const navigate = useNavigate();

    const sendEmail = () => {
        // 버튼 클릭 시 수행할 동작을 여기서 처리합니다.
        console.log("전송 버튼이 클릭되었습니다.");
    };

    const navFindUserId = () => {
        navigate("/auth/findUserId");
    }

    const navUpdatePwd = () => {
        navigate("/auth/updatePwd");
    }

    return (
        <Container className={`${st.container}`}>
            {/* "아이디 찾기" 텍스트를 오버레이로 상단에 배치 */}
            <div style={{height: "10%"}}></div>

            <div style={{height: "10%"}}>
                <div>
                    <h4 className={`${st.h8}`}><strong>아이디 찾기 or 비밀번호 찾기</strong></h4>
                </div>
            </div>
            <div style={{height: "20%"}}></div>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col xs={8}>
                    <Form.Control type="text" placeholder="이메일"
                                  className={`mb-3 ${st.h100}`}/>
                </Col>
                <Col xs={4}>
                    <Button type="button" className={`w-100 mb-3 ${st.emailButton} ${st.h100}`}
                            style={{minWidth: "50px"}}
                            onClick={sendEmail}
                    >
                        전송
                    </Button>
                </Col>
            </Row>
            <div style={{height: "15%"}}></div>
            <div style={{height: "5%"}}>
                <Button style={{backgroundColor:"#000000",
                    width:"21vh",
                    height:"6vh"}}
                        type="button"
                        onClick={ true ? navFindUserId : navUpdatePwd}
                >
                    <strong style={{fontSize:"1.8vh"}}>{ true ? "아이디 찾기" : "비밀번호 변경하기"}</strong>
                </Button>
            </div>
            <div style={{height: "20%"}}></div>
        </Container>
    );
};

export default EmailVerification;