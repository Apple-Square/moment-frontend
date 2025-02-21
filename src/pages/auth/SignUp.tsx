import React, {useCallback, useEffect, useMemo, useState, useRef} from "react";
import {Form, Col, Container, Row, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import st from "./css/signUp.module.css";
import d from "../../lib/css/default.module.css";
import MomentLogoNTextImg from "./component/MomentLogoNTextImg.tsx";
import {IoMdArrowRoundBack} from "react-icons/io";
import BirthdaySelector from "./component/BirthDaySelector.tsx";
import GenderSelector from "./component/GenderSelector.tsx";
import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";
import {getSessionItem, removeSessionItem, setSessionItem} from "../../lib/crypto.ts";
import lodash from "lodash";
import {userValidator} from "./function/userValidator.ts";
import {
    CheckDto,
    checkEmailRequest,
    checkNicknameRequest,
    checkUserIdRequest,
    sendEmailRequest, signUpRequest, validateEmailAuthCodeRequest
} from "./function/authAxios.ts";
import {SESSON_STORAGE_KEY, SESSON_STORAGE_REFRESH_TIME} from "./key/key.ts";
import DaumPostcode from "react-daum-postcode";
import {showToast} from "../../lib/ToastNotification.ts";

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

    const navigate: NavigateFunction = useNavigate();
    const DEBOUNCE_TIME = 700;

    const savedInfo: SignUpInfo = getSessionItem(SESSON_STORAGE_KEY);

    const [initializingPwd, setInitializingPwd] = useState<boolean>(false);

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
    const [pwdSuccess, setPwdSuccess] = useState<boolean>(false);

    const [pwd2, setPwd2] = useState("");
    const [pwd2Error, setPwd2Error] = useState("");
    const [pwd2Success, setPwd2Success] = useState<boolean>(false);

    /**
     * 사용자의 입력폼을 추적하는 email 속성과 사용자가 보낸 이메일을 저장하는 emailSended 속성은 따로 역할이 분리되어야 한다.
     * 사용자가 인증코드를 요청하고 나서 자신의 폼에 있는 email을 고친다면 , email 속성이 바뀌어 입력 검증이 제대로 되지 않는 문제가 생길 수 있다.
     */
    const [email, setEmail] = useState(""); // 이메일 값
    const [emailError, setEmailError] = useState("");
    /**
     * 이메일 입력 검증 성공 여부
     */
    const [emailFirstSuccess, setEmailFirstSuccess] = useState(false);
    /**
     * 이메일 중복 검증 성공 여부
     */
    const [emailSecondSuccess, setEmailSecondSuccess] = useState(false);
    const [emailSendSuccess, setEmailSendSuccess] = useState(false);
    const [emailAuthCode, setEmailAuthCode] = useState("");
    const [emailAuthSuccess, setEmailAuthSuccess] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    //
    const [emailSended, setEmailSended] = useState("");

    //""아니면 성공
    const [address, setAddress] = useState("");
    const [postCodeMode, setPostCodeMode] = useState<boolean>(false);


    /**
     * 보안 상의 이유로 사용하지 않는 게 낫겟다고 판단하여 주석처리하였습니다.
     */
        // useEffect(() => {
    //     if (savedInfo) {
    //         setNickname(savedInfo.nickname || "");
    //         setUserId(savedInfo.userId || "");
    //         setPwd(savedInfo.pwd || "");
    //         setPwd2(savedInfo.pwd2 || "");
    //         setEmail(savedInfo.email || "");
    //         setAddress(savedInfo.address || "");
    //
    //         // nickname, userId, pwd 등의 기본값 변경
    //         if (savedInfo.nickname) handleChange("nickname", savedInfo.nickname);
    //         if (savedInfo.userId) handleChange("userId", savedInfo.userId);
    //         if (savedInfo.email) handleChange("email", savedInfo.email);
    //         const timer = setTimeout(() => {
    //             if (savedInfo.pwd) {
    //                 handleChange("pwd", savedInfo.pwd);
    //                 setInitializingPwd(true);
    //             }
    //         }, DEBOUNCE_TIME);
    //         return () => clearTimeout(timer);
    //     }
    // }, []);

    // useEffect(() => {
    //     if (initializingPwd) {
    //         // pwd 상태가 업데이트된 후에만 handleChange("pwd2") 호출
    //         handleChange("pwd2", savedInfo.pwd2);
    //     }
    // }, [initializingPwd]);

    // const saveToSession = () => {
    //     const userInfo = {
    //         ...savedInfo,
    //         nickname,
    //         userId,
    //         pwd,
    //         pwd2,
    //         email,
    //         address,
    //     };
    //     setSessionItem(SESSON_STORAGE_KEY, userInfo);
    //     //console.log("세션 스토리지에 저장되었습니다!");
    // };
    //
    // const debouncedSaveToSession = useCallback(
    //     lodash.debounce(() => {
    //         saveToSession();
    //     }, SESSON_STORAGE_REFRESH_TIME),
    //     [nickname, userId, pwd, pwd2, email, address]
    // );
    //
    // useEffect(() => {
    //     debouncedSaveToSession();
    //     return () => {
    //         debouncedSaveToSession.cancel();
    //     };
    // }, [nickname, userId, pwd, pwd2, email, address])


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
        address: setAddress,
    };

    useEffect(() => {
        //pwd pwd2가 다르면 pwd2Error
        if (pwd && pwd2) {
            if (pwd !== pwd2) {
                setPwd2Error("비밀번호가 일치하지 않습니다.");
                setPwd2Success(false);
            } else {
                setPwd2Error("");
                setPwd2Success(true);
            }
        } else if (pwd2) {
            setPwd2Error("비밀번호가 일치하지 않습니다.");
            setPwd2Success(false);
        } else if (pwd) {
            setPwd2Error("");
            setPwd2Success(false);
        }
    }, [pwd, pwd2]);


    const handleChange = (key, value) => {
        if (key in stateMap) {
            // 상태 업데이트 setNickname와 같은 함수가 실행 됨.
            stateMap[key as keyof typeof stateMap](value);

            // 검증 로직 추가
            let errorMessage = "";

            //console.log(JSON.stringify("value좀 보자 좀 보자 ::"+value, null, 2));

            switch (key) {
                case "nickname":
                    errorMessage = userValidator.validateNickname(value);
                    setNicknameSecondSuccess(false);
                    // setNickname(value);
                    setNicknameError(errorMessage || "");
                    if (!errorMessage) setNicknameFirstSuccess(true)
                    else setNicknameFirstSuccess(false);
                    break;
                case "userId":
                    errorMessage = userValidator.validateUsername(value);
                    setUserIdSecondSuccess(false);
                    // setUserId(value);
                    setUserIdError(errorMessage || "");
                    if (!errorMessage) setUserIdFirstSuccess(true);
                    else setUserIdFirstSuccess(false);
                    break;
                case "pwd":
                    if (value === "") {
                        setPwdError("");
                        setPwdSuccess(false);
                    } else {
                        errorMessage = userValidator.validatePassword(value);
                        if (errorMessage) {
                            setPwdError(errorMessage);
                            setPwdSuccess(false);
                        } else {
                            setPwdError("");
                            setPwdSuccess(true);
                        }
                    }
                    break;
                case "pwd2":
                    errorMessage = userValidator.validatePasswordConfirm(pwd, value);
                    // setPwd2(value);
                    setPwd2Error(errorMessage || "");
                    setPwd2Success(errorMessage === "");
                    break;
                case "email":
                    errorMessage = userValidator.validateEmail(value);
                    setEmailSecondSuccess(false);
                    // setEmail(value);
                    setEmailError(errorMessage || "");
                    if (!errorMessage) setEmailFirstSuccess(true);
                    else setEmailFirstSuccess(false);
                    break;
                default:
                //console.warn(`알 수 없는 키 : ${key}`);
            }

        } else {
            //console.warn(`알 수 없는 키 : ${key}`);
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
                            //console.log("세컨드 석세스 가즈아 ::", response.available);
                            return response.available;
                        } catch (error) {
                            setError("알 수 없는 에러 발생");
                            setSecondSuccess(false);
                            //console.error("에러 발생:", error);
                            return false;
                        }
                    },
                    DEBOUNCE_TIME
                ),
            [checkDuplicate]
        );
    };

    /**
     * debouncedFn들
     */
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
                    //console.error("에러 발생:", error);
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

    const sendEmail = async () => {
        // 버튼 클릭 시 수행할 동작을 여기서 처리합니다.

        if (!emailFirstSuccess) return;

        setSendLoading(true);
        const response = await sendEmailRequest(email);
        setSendLoading(false);
        setEmailSended(email);

        //console.log("emailSended에 저장 :: " + emailSended);

        if (response instanceof Error) {
            setEmailError(response.message);
        }

        if (response === true) {
            setEmailSendSuccess(true);
            setEmailError("");
        }
    };

    const changePostCodeMode = () => {
        setPostCodeMode(prevMode => !prevMode);
    };

    const navBack = () => {
        navigate('/auth/authMain');
    }


    const checkAuthCode = async () => {
        //emailAuthCode를 api 부른다.
        //console.log(emailSended);
        const response = await validateEmailAuthCodeRequest(emailSended, emailAuthCode);

        if (response === true) {
            //인증성공 로직
            setEmailAuthSuccess(true);
            setEmailError("");
        } else {
            //실패시 띄워야할 로직
            setEmailError("인증 코드가 틀립니다.");
        }

    };
    const handleSignUp = async () => {
        const response = await signUpRequest(
            nickname, 
            userId, 
            pwd, 
            savedInfo?.year, 
            savedInfo?.month, 
            savedInfo?.day, 
            savedInfo?.gender, 
            email, 
            address
        );

        if (response === true) {
            navigate('/auth/authMain');
            showToast("success","회원가입에 성공하셨습니다.");
        } else if (response instanceof Error) {
            showToast("error",response?.message);
            console.error(response?.message); // 에러 메시지를 콘솔에 출력
        }
    }

    const themeObj = {
        bgColor: '#FFFFFF',
        pageBgColor: '#FFFFFF',
        postcodeTextColor: '#C05850',
        emphTextColor: '#222222',
    };

    const handleComplete = (data: any) => {
        const { zonecode, buildingName, roadAddress } = data;
        const fullAddress = `${roadAddress} ${buildingName ? `, ${buildingName}` : ''}`;
        setAddress(fullAddress);
        setPostCodeMode(false);
    };

    return !postCodeMode ?
        (<Container className={`${st.container} ${d.rootFont}`}>
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
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <div style={{paddingRight: "12px", paddingLeft: "12px"}}>
                        <div style={{position: "relative", width: "100%", padding: "0px"}}>
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
                                    left: "2%",
                                    position: "absolute",
                                    color: (nicknameSecondSuccess && !nicknameError) ? "green" : "red",
                                    fontSize: "0.6rem",
                                }}
                            >
                        {nicknameSecondSuccess ? "사용 가능" : ""}
                                {nicknameError ? nicknameError : ""}
                        </span>
                        </div>
                </div>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <div style={{paddingRight: "12px", paddingLeft: "12px"}}>
                        <div style={{position: "relative", width: "100%", padding: "0px"}}>
                            <Form.Control
                                type="text"
                                placeholder="아이디"
                                className={`mb-3 ${st.h100}`}
                                name="userId"
                                value={userId}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                isInvalid={!!userIdError}
                                isValid={userIdSecondSuccess}
                            />
                            <span
                                style={{
                                    top: "115%",
                                    left: "2%",
                                    position: "absolute",
                                    color: (userIdSecondSuccess && !userIdError) ? "green" : "red",
                                    fontSize: "0.6rem",
                                }}
                            >
                              {userIdSecondSuccess ? "사용 가능" : ""}
                                {userIdError ? userIdError : ""}
                            </span>
                        </div>
                </div>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <div style={{paddingRight: "12px", paddingLeft: "12px"}}>
                        <div style={{position: "relative", width: "100%", padding: "0px"}}>
                            <Form.Control
                                type="password"
                                placeholder="비밀번호"
                                className={`mb-3 ${st.h100}`}
                                name="pwd"
                                value={pwd}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                isInvalid={!!pwdError}
                                isValid={pwdSuccess}
                            />
                            <span
                                style={{
                                    top: "115%",
                                    left: "2%",
                                    position: "absolute",
                                    color: (pwdSuccess && !pwdError) ? "green" : "red",
                                    fontSize: "0.6rem",
                                }}
                            >
                              {pwdSuccess ? "사용 가능" : ""}
                                {pwdError ? pwdError : ""}
                            </span>
                        </div>
                </div>
            </Row>

            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <div style={{paddingRight: "12px", paddingLeft: "12px"}}>
                        <div style={{position: "relative", width: "100%", padding: "0px"}}>
                            <Form.Control
                                type="password"
                                placeholder="비밀번호 재입력"
                                className={`mb-3 ${st.h100}`}
                                name="pwd2"
                                value={pwd2}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                isInvalid={!!pwd2Error}
                                isValid={pwd2Success}
                            />
                            <span
                                style={{
                                    top: "115%",
                                    left: "2%",
                                    position: "absolute",
                                    color: (pwd2Success && !pwd2Error) ? "green" : "red",
                                    fontSize: "0.6rem",
                                }}
                            >
                          {pwd2Success &&"일치합니다"}
                                {pwd2Error ? pwd2Error : ""}
                        </span>
                        </div>
                </div>
            </Row>

            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <BirthdaySelector/>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <GenderSelector/>
            </Row>
            <Row className={`w-100 mb-2 ${st.h8} `} style={{minWidth: "300px"}}>
                <div style={{paddingRight: "12px", paddingLeft: "12px"}}>
                        <div style={{position: "relative", width: "100%", padding: "0px"}}>
                            <Row className="w-100 justify-content-end">
                                <Col xs={10}>
                                    <Form.Control
                                        type="text"
                                        placeholder="이메일"
                                        className={`mb-3 ${st.h100}`}
                                        name="email"
                                        value={email}
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                        isInvalid={!emailSendSuccess && !!emailError}
                                        isValid={emailSendSuccess}
                                        style={{fontSize: "0.6rem"}}
                                        readOnly={emailAuthSuccess}
                                    />
                                    <span
                                        style={{
                                            top: "80%",
                                            left: "2%",
                                            position: "absolute",
                                            color: (!emailSendSuccess && !!emailError) ? "red" : "green",
                                            fontSize: "0.6rem",
                                        }}
                                    >
                                        {sendLoading && "보내는 중"}
                                        {(!emailSendSuccess && !sendLoading && !!emailError) && emailError}
                                        {(!sendLoading && !emailError && emailSecondSuccess && !emailSendSuccess) ? "사용가능. 이메일 전송을 해주세요." : ""}
                                        {emailSendSuccess && !emailError ? "이메일에서 인증코드를 확인해주세요." : ""}
                                    </span>
                                </Col>
                                <Col xs={2} style={{padding: "0px 0px 0px 8px", marginLeft: "auto"}}>
                                    <Button
                                        type="button"
                                        className={`w-100 mb-3 ${st.emailButton} ${st.h100}`}
                                        style={{minWidth: "50px", padding: "0px"}}
                                        onClick={sendEmail}
                                        disabled={emailAuthSuccess || sendLoading || !!emailError || !emailFirstSuccess || !emailSecondSuccess}
                                    >
                                        전송
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                </div>
            </Row>

            {emailSendSuccess && (<Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <div style={{paddingRight: "12px", paddingLeft: "12px"}}>
                    <div style={{position: "relative", width: "100%", padding: "0px"}}>
                        <Row className="w-100 justify-content-end">
                            <Col xs={10}>
                                <Form.Control
                                    type="text"
                                    placeholder="인증번호"
                                    className={`mb-3 ${st.h100}`}
                                    style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}
                                    value={emailAuthCode}
                                    onChange={(e) => {
                                        setEmailAuthCode(e.target.value)
                                    }}
                                />
                                <span
                                    style={{
                                        top: "80%",
                                        left: "2%",
                                        position: "absolute",
                                        color: emailAuthSuccess ? "green" : "red",
                                        fontSize: "0.6rem",
                                    }}
                                >
                                    {emailAuthSuccess && "인증 완료"}
                                    {(!sendLoading && !!emailError) && emailError}
                                </span>
                            </Col>
                            <Col xs={2} style={{padding: "0px 0px 0px 8px", marginLeft: "auto"}}>
                                <Button
                                    type="button"
                                    className={`w-100 mb-3 ${st.emailButton} ${st.h100}`}
                                    style={{minWidth: "50px", padding: "0px"}}
                                    onClick={checkAuthCode}
                                    disabled={emailAuthSuccess}
                                >
                                    확인
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Row>)}

            <Row className={`w-100 mb-2 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col>
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
                            onClick={changePostCodeMode}
                            readOnly
                        />
                </Col>
            </Row>
            <Row className={`w-100 ${st.h8}`} style={{minWidth: "300px"}}>
                <Col className="d-flex justify-content-center">
                    <Button
                        className={`w-100
                        ${st.h100}
                        ${st.borderRadius}
                        ${st.loginButton}
                        d-flex align-items-center justify-content-center `}
                        disabled={
                            !nicknameSecondSuccess || 
                            !userIdSecondSuccess || 
                            !pwdSuccess || 
                            !pwd2Success || 
                            !emailAuthSuccess || 
                            !!pwd2Error || 
                            !!pwdError || 
                            !!userIdError || 
                            !!nicknameError || 
                            !((savedInfo?.year && savedInfo?.month && savedInfo?.day) || 
                              (!savedInfo?.year && !savedInfo?.month && !savedInfo?.day)) // 생일 유효성 검사 추가
                        }
                        onClick={handleSignUp}
                    >회원가입 하기</Button>
                </Col>
            </Row>

        </Container>) : <div>
                    <div
                        className={`${st.backButton}`}
                        onClick={changePostCodeMode}>
                        <IoMdArrowRoundBack size={32}/>
                    </div>
            <DaumPostcode
                theme={themeObj}
                onComplete={handleComplete}
            />
        </div>
};