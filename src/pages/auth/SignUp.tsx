import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Form, Col, Container, Row, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import st from "./css/signUp.module.css"
import MomentLogoNTextImg from "./component/MomentLogoNTextImg.tsx";
import {IoMdArrowRoundBack} from "react-icons/io";
import BirthdaySelector from "./component/BirthDaySelector.tsx";
import GenderSelector from "./component/GenderSelector.tsx";
import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";
import {getSessionItem, removeSessionItem, setSessionItem} from "../../lib/crypto.ts";
import {useDebouncedEffect} from "../../lib/useDebouncedEffect.ts";
import lodash from "lodash";
import {userValidator} from "./function/userValidator.ts";
import {CheckDto, checkEmailRequest, checkNicknameRequest, checkUserIdRequest} from "./function/authAxios.ts";

interface SignUpInfo {
    nickname : string;
    userId : string;
    pwd : string;
    pwd2 : string;
    year: number;
    month: number;
    day: number;
    gender : string;
    email : string;
    address ?: string;
}

export const SignUp:React.FC = () => {

    const navigate : NavigateFunction = useNavigate();

    const sessionStorageKey = "signUpInfo";
    const savedInfo = getSessionItem(sessionStorageKey);

    const [nickname, setNickname] = useState("");
    const [nicknameError, setNicknameError] = useState("");
    const [nicknameFirstSuccess, setNicknameFirstSuccess] = useState<boolean>(false);
    const [nicknameSecondSuccess, setNicknameSecondSuccess] = useState<boolean>(false);

    //두 석세스 true면 성공
    const [userId, setUserId] = useState("");
    const [userIdError, setUserIdError] = useState("");
    const [userIdFirstSuccess, setUserIdFirstSuccess] = useState(false);
    const [userIdSecondSuccess, setUserIdSecondSuccess] = useState(false);

    //에러가 없으면 성공
    const [pwd, setPwd] = useState("");
    const [pwdError, setPwdError] = useState("");

    const [pwd2, setPwd2] = useState("");
    const [pwd2Error, setPwd2Error] = useState("");

    const [email, setEmail] = useState(""); // 이메일 값
    const [emailError, setEmailError] = useState("");
    const [emailFirstSuccess, setEmailFirstSuccess] = useState(false);
    const [emailSecondSuccess, setEmailSecondSuccess] = useState(false);

    //0이 아니면 성공
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState(0);
    const [day, setDay] = useState(0);

    //""아니면 성공
    const [gender, setGender] = useState("");

    //""아니면 성공
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (savedInfo) {
            setNickname(savedInfo.nickname || "");
            setUserId(savedInfo.userId || "");
            setPwd(savedInfo.pwd || "");
            setPwd2(savedInfo.pwd2 || "");
            setEmail(savedInfo.email || "");
            setYear(savedInfo.year || 0);
            setMonth(savedInfo.month || 0);
            setDay(savedInfo.day || 0);
            setGender(savedInfo.gender || "");
            setAddress(savedInfo.address || "");
            handleChange("nickname",savedInfo.nickname);
            handleChange("userId",savedInfo.userId);
            handleChange("pwd",savedInfo.pwd);
            handleChange("pwd2",savedInfo.pwd2);
            handleChange("email",savedInfo.email);
        }
    }, []);

    const saveToSession = () => {
        const userInfo = {
            nickname,
            userId,
            pwd,
            pwd2,
            email,
            year,
            month,
            day,
            gender,
            address,
        };
        setSessionItem(sessionStorageKey, userInfo);
        console.log("세션 스토리지에 저장되었습니다!");
    };


    const stateMap = {
        nickname: setNickname,
        nicknameError: setNicknameError,
        userId: setUserId,
        userIdError: setUserIdError,
        pwd: setPwd,
        pwdError: setPwdError,
        pwd2: setPwd2,
        pwd2Error: setPwd2Error,
        email: setEmail,
        emailError: setEmailError,
        year: setYear,
        month: setMonth,
        day: setDay,
        gender: setGender,
        address: setAddress,
    };

    const debouncedSaveToSession = useCallback(
        lodash.debounce(() => {
            saveToSession();
        }, 500),
        [nickname, userId, pwd, pwd2, email, year, month, day, gender, address]
    );

    useEffect(() => {
        debouncedSaveToSession();
        return () => {
            debouncedSaveToSession.cancel();
        };
    }, [nickname, userId, pwd, pwd2, email, year, month, day, gender, address]);

    const handleChange =  (key, value) => {
            if (key in stateMap) {
                // 상태 업데이트
                stateMap[key as keyof typeof stateMap](value);

                // 검증 로직 추가
                let errorMessage = "";

                console.log(JSON.stringify("value좀 보자 좀 보자 ::"+value, null, 2));

                switch (key) {
                    case "nickname":
                        errorMessage = userValidator.validateNickname(value);
                        setNicknameSecondSuccess(false);
                        setNickname(value);
                        setNicknameError(errorMessage || "");
                        if (!errorMessage) setNicknameFirstSuccess(true)
                        else setNicknameFirstSuccess(false);
                        break;
                    case "userId":
                        errorMessage = userValidator.validateUsername(value);
                        setUserIdSecondSuccess(false);
                        setUserId(value);
                        setNicknameError(errorMessage || "");
                        if (!errorMessage) setUserIdFirstSuccess(true);
                        else setUserIdFirstSuccess(false);
                        break;
                    case "pwd":
                        errorMessage = userValidator.validatePassword(value);
                        setPwd(value);
                        setPwdError(errorMessage || "");
                        break;
                    case "pwd2":
                        errorMessage = userValidator.validatePasswordConfirm(pwd, value);
                        setPwd2(value);
                        setPwd2Error(errorMessage || "");
                        break;
                    case "email":
                        errorMessage = userValidator.validateEmail(value);
                        setEmailSecondSuccess(false);
                        setEmail(value);
                        setEmailError(errorMessage || "");
                        if (!errorMessage) setEmailFirstSuccess(true);
                        else setEmailFirstSuccess(false);
                        break;
                    default:
                        console.warn(`알 수 없는 키 : ${key}`);
                }

            } else {
                console.warn(`알 수 없는 키 : ${key}`);
            }
        };
    type CheckDuplicateFn = (value: string) => Promise<CheckDto | Error>;

    /**
     * debounce함수는 기본적으로 void를 반환함. 그래서 then catch가 불가능 IIFE 써야 함.
     * @param checkDuplicate
     */
    const useDebouncedCheckDuplicate = (checkDuplicate: CheckDuplicateFn) => {
        return useMemo(
            () =>
                lodash.debounce(
                    async (
                        key: string,
                        value: string,
                        setError: React.Dispatch<React.SetStateAction<string>>,
                        setSecondSuccess: React.Dispatch<React.SetStateAction<boolean>>
                    ) => {
                        try {
                            const response = await checkDuplicate(value);
                            if (response instanceof Error) {
                                setError(response.message);
                                setSecondSuccess(false);
                                return false;
                            }
                            setError(response.available ? "" : response.message);
                            setSecondSuccess(response.available);
                            console.log("세컨드 석세스 가즈아 ::", response.available);
                            return response.available;
                        } catch (error) {
                            setError("An unexpected error occurred");
                            setSecondSuccess(false);
                            console.error("에러 발생:", error);
                            return false;
                        }
                    },
                    700
                ),
            [checkDuplicate]
        );
    };

    const debouncedCheckNickname = useDebouncedCheckDuplicate(checkNicknameRequest);
    const debouncedCheckUserId = useDebouncedCheckDuplicate(checkUserIdRequest);
    const debouncedCheckEmail = useDebouncedCheckDuplicate(checkEmailRequest);

    const useDebouncedCheck = (
        key: string,
        value: string,
        firstSuccess: boolean,
        setError: React.Dispatch<React.SetStateAction<string>>,
        debouncedFn: any,
        setSecondSuccess: React.Dispatch<React.SetStateAction<boolean>>) => {
        useEffect(() => {
            if (!firstSuccess) return;

            (async () => {
                try {
                    // debouncedCheckNickname이 반환하는 Promise를 대기함
                    await debouncedFn(
                        key,
                        value,
                        setError,
                        setSecondSuccess
                    );
                    // 필요하다면 여기서 추가 처리 가능
                } catch (error) {
                    console.error("에러 발생:", error);
                }
            })();

            return () => {
                debouncedFn.cancel();
            };
        }, [value, firstSuccess, debouncedFn, setError, setSecondSuccess, key]);
    };

    useDebouncedCheck(
        "nickname",
        nickname,
        nicknameFirstSuccess,
        setNicknameError,
        debouncedCheckNickname,
        setNicknameSecondSuccess
    );

    useDebouncedCheck(
        "userId",
        userId,
        userIdFirstSuccess,
        setUserIdError,
        debouncedCheckUserId,
        setUserIdSecondSuccess
    );

    useDebouncedCheck(
        "email",
        email,
        emailFirstSuccess,
        setEmailError,
        debouncedCheckEmail,
        setEmailSecondSuccess
    );

    const sendEmail = () => {
        // 버튼 클릭 시 수행할 동작을 여기서 처리합니다.
        console.log("전송 버튼이 클릭되었습니다.");
    };

    const navPostCode = () => {
        navigate('/auth/postcode');
    };

    const navBack = () => {
        navigate('/auth/authMain');
    }

    const setBirthCallback = (year: number, month: number, day: number) => {
        setYear(year); // year 상태 업데이트
        setMonth(month); // month 상태 업데이트
        setDay(day); // day 상태 업데이트
    };

    const setGenderCallback = (gender: string) => {
        setGender(gender); // gender 상태 업데이트
    };


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
                <div style={{paddingRight:"12px",paddingLeft:"12px"}}>
                    <OverlayTrigger
                        placement="right"
                        overlay={
                            nicknameError ? (
                                <Tooltip id="tooltip-nickname">{nicknameError}</Tooltip>
                            ) : <></>
                        }
                    >
                        <div style={{ position: "relative", width: "100%", padding : "0px" }}>
                        <Form.Control
                            type="text"
                            placeholder="닉네임"
                            className={`mb-3 ${st.h100}`}
                            name="nickname"
                            value={nickname}
                            onInput={(e) => handleChange(e.currentTarget.name, e.currentTarget.value)}
                            isInvalid={!!nicknameError}
                            isValid={nicknameSecondSuccess}
                        />
                        <span
                            style={{
                                top: "115%",
                                left : "2%",
                                position: "absolute",
                                color: nicknameSecondSuccess ? "green" : "gray",
                                fontSize: "0.6rem",
                            }}
                        >
                        {nicknameSecondSuccess ? "사용 가능" : ""}
                        </span>
                        </div>
                    </OverlayTrigger>
                </div>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="아이디"
                        name="userId"
                        value={userId}
                        onChange={(e)=>handleChange(e.target.name, e.target.value)}
                        className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control
                        type="password"
                        placeholder="비밀번호"
                        name="pwd"
                        value={pwd}
                        onChange={(e)=>handleChange(e.target.name,e.target.value)}
                        className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
                    <Form.Control
                        type="password"
                        placeholder="비밀번호 재입력"
                        name="pwd2"
                        value={pwd2}
                        onChange={(e)=>handleChange(e.target.name, e.target.value)}
                        className={`mb-3 ${st.h100}`}/>
                </Col>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <BirthdaySelector setBirthCallback = {setBirthCallback}/>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <GenderSelector setGenderCallback={setGenderCallback}/>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col xs={8}>
                    <Form.Control
                        type="text"
                        placeholder="이메일"
                        name="email"
                        value={email}
                        onChange={(e)=>handleChange(e.target.name, e.target.value)}
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
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id="tooltip-address">
                                {address || "주소가 입력되지 않았습니다."}
                            </Tooltip>
                        }
                    >
                        <Form.Control
                            type="text"
                            placeholder="주소지"
                            className={`mb-3 ${st.h100}`}
                            style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}
                            value={address || ""}
                            onClick={navPostCode}
                            readOnly
                        />
                    </OverlayTrigger>
                </Col>
            </Row>
            <Row className={`w-100 ${st.h8}`}  style={{minWidth: "300px"}}>
                <Col className="d-flex justify-content-center">
                    <Button className={`w-100 ${st.h100} ${st.borderRadius} ${st.loginButton} d-flex align-items-center justify-content-center `}>회원가입 하기</Button>
                </Col>
            </Row>

        </Container>
    );
};
