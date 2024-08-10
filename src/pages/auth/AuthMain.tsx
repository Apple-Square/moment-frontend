import {Button, Col, Container, Form, Row} from "react-bootstrap";
import styles from "./css/authMain.module.css";
import KakaoButtonImg from "./component/KakaoButtonImg.tsx";
import GoogleLogoImg from "./component/GoogleLogoImg.tsx";
import MomentLogoNTextImg from "./component/MomentLogoNTextImg.tsx";
import React from "react";
export const AuthMain: React.FC = () => {


    return (
            <Container className={`${styles.container}`}>
                <Row className={`${styles.emptyTopRow}`}/>
                <Row className={`w-100 mb-4 ${styles.h15}`} style={{minWidth: "300px"}}>
                    <Col className="d-flex justify-content-center" style={{ maxHeight: "100%" }}>
                        <div className={`${styles.momentLogoNTextImg}`}>
                            <MomentLogoNTextImg style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }} />
                        </div>
                    </Col>
                </Row>
                <Row className={`${styles.emptyMiddleRow}`}/>
                <Row className={`w-100 mb-3 ${styles.h8}`} style={{minWidth: "300px"}}>
                    <Col className="d-flex justify-content-center">
                        <Form.Control type="text" placeholder="아이디"
                                      className={`mb-3 ${styles.h100}`} />
                    </Col>
                </Row>
                <Row className={`w-100 mb-3 ${styles.h8}`}  style={{minWidth: "300px"}}>
                    <Col className="d-flex justify-content-center">
                        <Form.Control type="password" placeholder="비밀번호" className={`mb-3 ${styles.h100}`} />
                    </Col>
                </Row>

                <Row className={`w-100 ${styles.h8}`}  style={{minWidth: "300px"}}>
                    <Col className="d-flex justify-content-center">
                      <Button className={`w-100 ${styles.h100} ${styles.borderRadius} ${styles.loginButton}`}>로그인</Button>
                    </Col>
                </Row>

                <Row className={`w-100 mb-4`} style={{fontSize:"10px", minWidth: "300px"}}>
                    <Col className="d-flex justify-content-end">
                        <span>회원가입</span>
                        <span style={{marginLeft: "5px", marginRight: "5px"}}>|</span>
                        <span>아이디 찾기</span>
                        <span style={{marginLeft: "5px", marginRight: "5px"}}>|</span>
                        <span>비밀번호 찾기</span>
                    </Col>
                </Row>

                <Row className={`w-100 mb-3 ${styles.h6}`}
                     style={{ height: "auto", minHeight: "40px", maxHeight: "40px", minWidth: "300px" }} >
                    <Col className="d-flex justify-content-center" style={{minHeight: "40px", maxHeight: "40px" }} >
                        <button
                            style={{
                                padding: "0px", /* 패딩 제거 */
                                border: "none", /* 보더 제거 */
                                background: "none", /* 배경 제거 */
                                display: "flex", /* Flexbox 사용 */
                                alignItems: "center", /* 이미지와 버튼을 수직으로 가운데 정렬 */
                                lineHeight: "0", /* 라인 높이 설정을 제거 */
                            }}
                        >
                            <KakaoButtonImg
                                className={`${styles.kakaoButtonImg}`}
                                style={{
                                    display: "block", /* 이미지를 블록으로 표시하여 크기 조정 */
                                    maxWidth: "100%",
                                    width: "100%",
                                    height: "100%"
                                }}
                            />
                        </button>
                    </Col>
                </Row>
                <Row className={` w-100 mb-3 ${styles.h6}`}
                     style={{ height: "auto", minHeight: "40px", maxHeight: "40px", minWidth: "300px" }}>
                    <Col className="d-flex justify-content-center" style={{ width:"30%", height: "auto", minHeight: "40px", maxHeight: "40px" }}>
                        <Button
                            variant="light"
                            style={{
                                maxWidth: "266px", // 부모의 30%를 차지하도록 강제
                                border: "3px solid #ffffff",
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                padding: "0px",
                            }}
                            className={`${styles.googleButtonImg}`}
                        >
                            {/* 로고를 왼쪽에 고정 */}
                            <div style={{ flex: '0 0 36%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '0.3rem' }}>
                                <GoogleLogoImg />
                            </div>

                            {/* 텍스트를 원하는 위치에 정렬 */}
                            <div style={{ flex: '1 1 64%', display: 'flex', justifyContent: 'flex-start' }}>
                                <span style={{ fontSize: "13px" }}>Google 로그인</span>
                            </div>
                        </Button>
                    </Col>
                </Row>
            </Container>
    )
}