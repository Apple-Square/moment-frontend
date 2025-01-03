import React, {useEffect, useState} from 'react';
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import st from "./css/signUp.module.css";
import {useNavigate, useSearchParams} from "react-router-dom";
import f from "../../lib/css/default.module.css";
import d from "../../lib/css/default.module.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import MomentLogoNTextImg from "./component/MomentLogoNTextImg.tsx";
import {userValidator} from "./function/userValidator.ts";
import {passwordRecoveryRequest} from "./function/authAxios.ts";
import {showAlert, showToast} from "../../lib/ToastNotification.ts";

const UpdatePwd: React.FC = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [pwd, setPwd] = useState<string>("");
    const [pwdError, setPwdError] = useState<string | null>(null);
    const [pwdSuccess, setPwdSuccess] = useState<boolean>(false);

    const [pwd2, setPwd2] = useState<string>("");
    const [pwd2Error, setPwd2Error] = useState<string>("");
    const [pwd2Success, setPwd2Success] = useState<boolean>(false);

    const handlePwdChange = (value: string) => {
        const errorMessage = userValidator.validatePassword(value);
        setPwd(value);
        setPwdError(errorMessage || "");
        setPwdSuccess(!errorMessage);
    };

    const handlePwdConfirmChange = (value: string) => {
        const errorMessage = userValidator.validatePasswordConfirm(pwd, value);
        setPwd2(value);
        setPwd2Error(errorMessage || "");
        setPwd2Success(errorMessage === "");
    };


    const resetPassword = async () => {
        if (token) {
            const response = await passwordRecoveryRequest(token, pwd);
            if (response instanceof Error) {
                showToast("error",response.message,1000,'15px');
            } else if (response) {
                showAlert("","변경 성공 \n \n 로그인하러 갑니다.");
                navigate("/auth/authMain");
            } else {
                showAlert("error", "알 수 없는 에러");
            }
        }

    }

    const navBack = () => {
        navigate('/auth/authMain');
    }

    return (
        <Container className={`${st.container2} ${d.rootFont}`}>
            {/* 헤더: 뒤로 가기 버튼 및 로고 */}
            <Row className="d-flex justify-content-between align-items-center w-100 mb-4 mt-4">
                <Col xs="auto" style={{ height: "auto" }}>
                    <div
                        className={`${st.backButton}`}
                        onClick={navBack}>
                        <IoMdArrowRoundBack size={32} />
                    </div>
                </Col>
                <Col xs="auto" style={{ maxWidth: "80px" }}>
                    <MomentLogoNTextImg />
                </Col>
            </Row>

            {/* 페이지 제목 */}
            <Row className={`w-100 ${f.flexCenter}`} style={{ minHeight: "230px", maxHeight : "1024px", margin: "0px", fontSize: "2rem", fontWeight: "bold" }}>
                <div style={{
                    minHeight: "84px"
                }}></div>
                <div className={`${f.flexCenter}`} style={{
                    minHeight: "35px",
                }}>비밀번호 재설정</div>
                <div style={{ minHeight: "105px" }}></div>
            </Row>

            {/* 입력 폼 */}
            <Row className={`w-100 ${f.flexCenter}`}
                 style={{minWidth: "300px", maxWidth: "500px", margin: "0px", height : "160px"}}>
                <Col xs={12} className={`${f.flexCenter} mb-3`} style={{position:"relative"}}>
                    <Form.Control
                        type="password"
                        placeholder="새 비밀번호"
                        value={pwd}
                        onChange={(e) => handlePwdChange(e.target.value)}
                        className={`${st.h100}`}
                    />
                    <span
                        style={{
                            top: "115%",
                            left: "2.5%",
                            position: "absolute",
                            color: (pwdSuccess && !pwdError) ? "green" : "red",
                            fontSize: "0.6rem",
                        }}
                    >
                              {pwdSuccess ? "사용 가능" : ""}
                        {pwdError ? pwdError : ""}
                            </span>
                </Col>
                <Col xs={12} className={`${f.flexCenter} mb-3`} style={{position:"relative"}}>
                    <Form.Control
                        type="password"
                        placeholder="새 비밀번호 확인"
                        value={pwd2}
                        onChange={(e) => handlePwdConfirmChange(e.target.value)}
                        className={`${st.h100}`}
                    />
                    <span
                        style={{
                            top: "115%",
                            left: "2.5%",
                            position: "absolute",
                            color: (pwd2Success && !pwd2Error) ? "green" : "red",
                            fontSize: "0.6rem",
                        }}
                    >
                    {pwd2Success ? "일치합니다" : ""}
                    {pwd2Error ? pwd2Error : ""}
                </span>
                </Col>
                <Col xs={12} className={`${f.flexCenter}`}>
                    <Button
                        type="button"
                        className={`w-100 ${st.emailButton} ${st.h100}`}
                        onClick={resetPassword}
                        disabled={!(!pwdError && pwdSuccess && !pwd2Error && pwd2Success)}
                    >
                        비밀번호 재설정
                    </Button>
                </Col>
            </Row>

            <div style={{height: "210px"}}></div>
        </Container>
    );
};

export default UpdatePwd;
