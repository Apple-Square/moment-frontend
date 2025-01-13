import React, {useState} from 'react';
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import st from "./css/signUp.module.css";
import {useNavigate, useParams} from "react-router-dom";
import f from "../../lib/css/default.module.css";
import d from "../../lib/css/default.module.css";
import {IoMdArrowRoundBack} from "react-icons/io";
import MomentLogoNTextImg from "./component/MomentLogoNTextImg.tsx";
import {accountRecoveryRequest} from "./function/authAxios.ts";
const EmailVerification:React.FC = () => {

    const { type } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");

    const [emailError, setEmailError] = useState<string | null>(null); // 오류 또는 성공 메시지
    const [emailSuccess, setEmailSuccess] = useState<string>("");
    const sendEmail = async () => {
        setEmailSuccess(""); // 이전 메시지 초기화
        setEmailError("");
        const result = await accountRecoveryRequest(email);

        if (result instanceof Error) {

            setEmailError(result.message); // 오류 메시지를 상태로 설정
        } else {
            setEmailSuccess(result); // 성공 메시지를 상태로 설정
        }
    };

    const navBack = () => {
        navigate('/auth/authMain');
    }
    return (
        <Container className={`${st.container2} ${d.rootFont}`}>
            <Row className="d-flex justify-content-between align-items-center w-100 mb-4 mt-4">
                <Col xs="auto" style={{height: "auto"}}>
                    <div
                        className={`${st.backButton}`}
                        onClick={navBack}>
                        <IoMdArrowRoundBack size={32}/>
                    </div>
                </Col>
                <Col xs="auto" style={{maxWidth: "80px"}}>
                    <MomentLogoNTextImg/>
                </Col>
            </Row>
            <Row className={`w-100 ${f.flexCenter}`} style={{minHeight : "33vh", margin:"0px", fontSize : "2rem", fontWeight : "bold"}}>
                <div style={{
                    minHeight : "12vh"
                }}></div>
                <div className={`${f.flexCenter}`} style={{
                    minHeight : "5vh",
                }}>{type === "id" ? "아이디 찾기" : "비밀번호 재설정" }</div>
                <div style={{minHeight : "15vh"}}></div>
            </Row>
            <Row className={`w-100 ${st.h8} ${f.flexCenter}`} style={{minWidth: "300px",maxWidth: "500px", margin:"0px"}}>
                <Col xs={9} className={`${f.flexCenter}`}>
                    <Form.Control
                        type="text"
                        placeholder="이메일"
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}
                        className={`${st.h100}`}/>
                </Col>
                <Col xs={3} className={`${f.flexCenter}`}>
                    <Button type="button" className={`w-100 ${st.emailButton} ${st.h100}`}
                            style={{minWidth: "30px"}}
                            onClick={sendEmail}
                    >
                        전송
                    </Button>
                </Col>
            </Row>
            <Row className={`w-100 ${f.flexCenter}`} style={{ minWidth: "300px", maxWidth: "500px", marginTop: "10px" }}>
                <Col xs={12}>
                    {emailError && (
                        <div
                            className={`${f.flexCenter}`}
                            style={{
                                color: "red", // 성공: 녹색, 오류: 빨간색
                                fontSize: "0.9rem",
                                textAlign: "center",
                            }}
                        >
                            {emailError}
                        </div>
                    )}
                    {emailSuccess && (
                        <div
                            className={`${f.flexCenter}`}
                            style={{
                                color:  "green", // 성공: 녹색, 오류: 빨간색
                                fontSize: "0.9rem",
                                textAlign: "center",
                            }}
                        >
                            {emailSuccess}
                        </div>
                    )}
                </Col>
            </Row>
            <div style={{height: "15%"}}></div>
        </Container>
    );
};

export default EmailVerification;