import React, {useState} from "react";
import {Form, Col, Container, Row, Button} from "react-bootstrap";
import st from "./css/signUp.module.css"
import MomentLogoNTextImg from "./component/MomentLogoNTextImg.tsx";
import {IoMdArrowRoundBack} from "react-icons/io";
import BirthdaySelector from "./component/BirthDaySelector.tsx";
import GenderSelector from "./component/GenderSelector.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";



export const SignUp:React.FC = () => {

    const navigate : NavigateFunction = useNavigate();

    const [year, setYear] = useState<number>(0);
    const [month, setMonth] = useState<number>(0);
    const [day, setDay] = useState<number>(0);

    const setBirthCallback = (year : number, month : number, day : number) => {
        setYear(year);
        setMonth(month);
        setDay(day);
    };


    const sendEmail = () => {
        // 버튼 클릭 시 수행할 동작을 여기서 처리합니다.
        console.log("전송 버튼이 클릭되었습니다.");
    };

    const navPostCode = () => {

        navigate('/auth/postcode', {
            state: {
                previousPage: '/auth/signUp',
                nickname: "userNickname",
                userId: "userId",
                pwd: "password",
                pwd2: "password2",
                gender: "gender",
                email: "user@example.com",
                birth: "birthdate",
            },
        });
    }

    const navBack = () => {
        navigate('/auth/authMain');
    }

    return (
        <Container className={`${st.container}`}>
            <Row className="d-flex justify-content-between align-items-center w-100 mb-4">
                <Col xs="auto" style={{height:"auto"}}>
                    <div
                        className={`${st.backButton}`}
                        onClick={navBack}>
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
                <BirthdaySelector setBirthCallback = {setBirthCallback}/>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <GenderSelector/>
            </Row>
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
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control type="text" placeholder="주소지"
                                  className={`mb-3 ${st.h100}`}
                                  onClick={navPostCode}
                    />
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
