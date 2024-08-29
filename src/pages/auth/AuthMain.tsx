import {Button, Col, Container, Form, Row} from "react-bootstrap";
import styles from "./css/authMain.module.css";
import KakaoButtonImg from "./component/KakaoButtonImg.tsx";
import GoogleLogoImg from "./component/GoogleLogoImg.tsx";
import MomentLogoNTextImg from "./component/MomentLogoNTextImg.tsx";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useImmer} from "use-immer";
import {loginThunk} from "../../redux/slices/authSlice.ts";
import {RootState} from "../../redux/store/store.ts";
import {useAppDispatch, useAppSelector} from "../../redux/store/hooks.ts";
import {LoginState} from "../../interface/DomainInterface.ts";
import {LoginThunkArgs} from "../../interface/OtherInterface.ts";
import {JSONColor} from "../../lib/deepLog.ts";
import {showToast} from "../../lib/ToastNotification.ts";

export const AuthMain: React.FC = () => {

    const [loginState, updateLoginState]
        = useImmer<(LoginState)>({
            username: '',
            password: ''
        }
    );
    const auth = useAppSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(()=> {
        console.log("store :: "+JSON.stringify(auth));
        if(auth.isAuthenticated){
            navigate('/user/profile');
        }
    },[auth, navigate]);

    const handleUsernameChange = <T extends HTMLInputElement>(e : ChangeEvent<T>) => {
        const { name, value } = e.target;
        updateLoginState(draft => {
            draft[name as keyof LoginState] = value;
            console.log(`유저네임 onChange\ndraft :: ${JSON.stringify(draft)}\nname :: ${name}\nvalue :: ${value}`);
        })
        //검사하고 메세지 보내기
    }

    const handlePasswordChange = (e : ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateLoginState(draft => {
            draft[name as keyof LoginState] = value;
            console.log(`패스워드 onChange\ndraft :: ${JSON.stringify(draft)}\nname :: ${name}\nvalue :: ${value}`);
        })
    }

    const handleLogin = async () => {
        try {
            console.log(`로그인 실행`);
            const loginThunkArgs: LoginThunkArgs = {
                loginState
            };
            await dispatch(loginThunk(loginThunkArgs));
        } catch (error) {
            console.log(`로그인 에러 캐치했음 :: ${JSONColor.stringify(error)}`);
            showToast("로그인에 실패하였습니다",)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

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
                <Row className={`w-100 mb-3 ${styles.h8}`} style={{minWidth: "300px", maxWidth: "300px"}}>
                    <Col className="d-flex justify-content-center">
                        <Form.Control
                            type="text"
                            placeholder="아이디"
                            className={`mb-3 ${styles.h100}`}
                            name="username"
                            onChange={handleUsernameChange}
                        />
                    </Col>
                </Row>
                <Row className={`w-100 mb-3 ${styles.h8}`}  style={{minWidth: "300px", maxWidth: "300px"}}>
                    <Col className="d-flex justify-content-center">
                        <Form.Control
                            type="password"
                            placeholder="비밀번호"
                            name="password"
                            className={`mb-3 ${styles.h100}`}
                            onChange={handlePasswordChange}
                        />
                    </Col>
                </Row>

                <Row className={`w-100 ${styles.h8}`}  style={{minWidth: "300px", maxWidth: "300px"}}>
                    <Col className="d-flex justify-content-center">
                      <Button
                        type="button"
                        className={`w-100 ${styles.h100} ${styles.borderRadius} ${styles.loginButton}`}
                        onClick={handleLogin}
                      >로그인</Button>
                    </Col>
                </Row>

                <Row className={`w-100 mb-4`} style={{fontSize:"10px", minWidth: "300px", maxWidth: "300px"}}>
                    <Col className="d-flex justify-content-end">
                        <Link to="/auth/signUp">
                        <span>회원가입</span>
                        </Link>
                        <span style={{marginLeft: "5px", marginRight: "5px"}}>|</span>
                        <Link to="/auth/emailVerification">
                        <span>아이디 찾기</span>
                        </Link>
                        <span style={{marginLeft: "5px", marginRight: "5px"}}>|</span>
                        <Link to="/auth/emailVerification">
                        <span>비밀번호 재설정</span>
                        </Link>
                    </Col>
                </Row>

                <Row className={`w-100 mb-3 ${styles.h6}`}
                     style={{ height: "auto", minHeight: "40px", maxHeight: "40px", minWidth: "300px" }} >
                    <Col className="d-flex justify-content-center" style={{minHeight: "40px", maxHeight: "40px" }} >
                        <button
                            type="button"
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
                            type="button"
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