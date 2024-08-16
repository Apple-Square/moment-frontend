import React from 'react';
import st from "./css/signUp.module.css";
import {Button, Col, Container, Row} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import { motion } from "framer-motion";
const FindUserId:React.FC = () => {

    const { userId } = useParams();

    return (
        <>
            <Container className={`${st.container}`}>
                <Row className="w-100" style={{ height: '50vh' }}>
                    <Col xs={12}>
                        <h4>
                            <strong>회원 아이디 확인</strong>
                        </h4>
                        <div style={{height: "20%"}}/>
                        {userId === undefined ? (
                            <div style={{fontSize:"2.5vh"}}>
                                아이디를 찾을 수 없습니다.
                            </div>
                        ) : (
                            <div>
                                가입하신 회원님의 아이디는{" "}
                                <strong className={st.typicalColor}>{userId}</strong>{" "}
                                입니다.
                            </div>
                        )}
                        <div style={{height: "30%"}}/>
                        <div>
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: [0, 1, 0]}}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                <Link to="/auth/authMain">
                                    <Button style={{backgroundColor:"#000000",
                                    width:"15vh",
                                    height:"5vh"}}
                                    type="button">
                                        <strong style={{fontSize:"2vh"}}>로그인 하기</strong>
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default FindUserId;