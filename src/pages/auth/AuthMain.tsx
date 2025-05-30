import {Button, Col, Container, Form, Row} from "react-bootstrap";
import styles from "./css/authMain.module.css";
import KakaoButtonImg from "./component/KakaoButtonImg.tsx";
import NaverButtonImg from "./component/NaverButtonImg.tsx";
import MomentLogoNTextImg from "./component/MomentLogoNTextImg.tsx";
import React, {ChangeEvent, Children, ReactElement, useCallback, useEffect, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Updater, useImmer} from "use-immer";
import {loginThunk} from "../../redux/slices/authSlice.ts";
import {RootState} from "../../redux/store/store.ts";
import {useAppDispatch, useAppSelector} from "../../redux/store/hooks.ts";
import { LoginState} from "../../interface/DomainInterface.ts";
import {LoginThunkArgs} from "../../interface/OtherInterface.ts";
import {JSONColor} from "../../lib/deepLog.ts";
import {showToast} from "../../lib/ToastNotification.ts";
import {debounce} from "lodash";
import {userValidator} from "./function/userValidator.ts";
import {axiosInstance, tokenManager} from "../../lib/axiosInstance.ts";
import layout from "../common/css/layout.module.css";
import {kakaoLoginRequest, naverLoginRequest} from "./function/authAxios.ts";
import d from "../../lib/css/default.module.css";

const debouncedValidateInput = debounce((name: string, value: string, updateLoginState: Updater<LoginState>) => {
    let error = "";

    if (name === "username") {
        error = userValidator.validateUsername(value);
    } else {
        error = userValidator.validatePassword(value);
    }

    // 에러 메시지 상태 업데이트
    updateLoginState(draft => {
        draft[(name + "Error") as keyof LoginState] = error;
    });

    console.log(`유효성 검사\nname :: ${name}\nvalue :: ${value}\nerror :: ${error}`);
}, 300);  // 300ms 디바운스 적용


/**
 * React.memo는 props가 변경되지 않는 한 리렌더링 X
 * 즉, onChange와 onKeyDown 핸들러가 매번 새로운 함수로 생성되지 않도록 해야 함
 * 그래서 useCallback을 사용
 */

const ErrorMessage : React.FC<{children, style?}> = ({children, style}) => {
    return (
        <div
            className={`position-absolute w-100`}
            style={{left: "6%", top:"87%", zIndex: 1, fontSize:"13px", color:"#f44e4e", ...style}}
        >
            {children}
        </div>
    )
}

const InputField: React.FC<{
    type: string;
    placeholder: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    error: string;
}> = React.memo(({type, placeholder, name, value, onChange, onKeyDown, error}) => {
        return (
            <>
                <Row className={` w-100 mb-3 ${styles.h8}`}
                     style={{minWidth: "300px", maxWidth: "300px", maxHeight : "50px"}}
                >
                    <Col className="position-relative d-flex justify-content-center">
                        <Form.Control
                            type={type}
                            placeholder={placeholder}
                            name={name}
                            className={`mb-0 ${styles.h100}`}
                            value={value}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                        />
                        <ErrorMessage>
                            {error}
                        </ErrorMessage>
                    </Col>
                </Row>
            </>
        )
    }
)

const LoginArea: React.FC<{
    children: React.ReactNode;
}> = ({children}) => {

    const [loginState, updateLoginState]
        = useImmer<(LoginState)>({
            username: '',
            password: '',
            usernameError: '',
            passwordError: '',
        }
    );
    const auth = useAppSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [token, setToken] = useState(tokenManager.getToken());

    useEffect(() => {
        const checkToken = () => {
            const newToken = tokenManager.getToken();
            if (newToken !== token) {
                setToken(newToken);
            }
        };

        // 주기적으로 tokenManager에서 값을 확인
        const interval = setInterval(checkToken, 100000); // 100초마다 토큰 변경 확인
        return () => clearInterval(interval); // 컴포넌트가 언마운트되면 interval 정리
    }, [token]);

    useEffect(() => {
        // console.log("store :: "+JSON.stringify(auth, null, 2));
        if(auth.isAuthenticated || token !== ""){
            navigate('/user/profile');
            showToast("success", "로그인에 성공하였습니다", 1000);
        }
    }, [auth, navigate, token]);

    // useEffect(() => {
    //     console.log("계속 로그 찍기"+JSON.stringify(loginState, null, 2));
    // });



    const handleUsernameChange = useCallback(<T extends HTMLInputElement>(e: ChangeEvent<T>) => {
        const { name, value } = e.target;
        updateLoginState(draft => {
            draft[name as keyof LoginState] = value;
        })
        debouncedValidateInput(name, value, updateLoginState);
    }, [debouncedValidateInput,updateLoginState]);


    const handlePasswordChange = useCallback((e : ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateLoginState(draft => {
            draft[name as keyof LoginState] = value;
        })
        debouncedValidateInput(updateLoginState,name, value);
    }, [debouncedValidateInput,updateLoginState]);

    /**
     * loginThunk > userAxios > axiosInstance
     */
    const handleLogin = useCallback(async () => {
        try {
            //여기 어떨때는 상태가 반영되고 어떨때는 다 사라진다.
            //디바운스 관련해서 상태가 문제인듯 하다 시간 늘려보고 useEffect로 상태 계속 확인해보자.
            console.log("handleLogin" + JSON.stringify(loginState, null, 2));
            // console.log(`로그인 실행`);
            const {username, password}: LoginThunkArgs = loginState;

            const data = await dispatch(loginThunk({username, password}));

            console.log(`data :: ${JSONColor.stringify(data)}`);
            if(data?.type ==="auth/login/rejected"){
                console.log(`data :: ${JSONColor.stringify(data.payload)}`);
                showToast("error",data.payload,1000);
                return;
            }

        } catch (error) {
            console.log(`AuthMain에서 에러 :: ${JSONColor.stringify(error)}`);
            showToast("error","로그인에 실패하였습니다",1000);
        }
    },[loginState]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    /**`
     *LoginArea의 props가 LoginButton이고,
     *LoginButton은 handleLogin을 props로 받는다.
     *하지만 handleLogin은 LoginArea의 state를 사용한다.
     *그런 경우에 LoginButton의 props를 선택적으로 하고, LoginArea에서 새로 LoginButton을 props와 병합해서 생성.
     */
    const memoizedLoginButton = useMemo(() => {
        return React.Children.map(children, child => {
                    return React.cloneElement(child as ReactElement, {handleLogin});
                return child; // ReactNode가 ReactElement가 아닌 경우 그대로 반환
            }
        );
    },[handleLogin, children]);

    return (
        <>
            <InputField
                type="text"
                placeholder="아이디"
                name="username"
                value={loginState.username}
                onChange={handleUsernameChange}
                onKeyDown={handleKeyDown}
                error={loginState.usernameError}
            />
            <InputField
                type="password"
                placeholder="비밀번호"
                name="password"
                value={loginState.password}
                onChange={handlePasswordChange}
                onKeyDown={handleKeyDown}
                error={loginState.passwordError}
            />
            {memoizedLoginButton}
        </>
    )
};

/**
 * useEffect로 확인해보면 단 한번만 렌더링되는 걸 알 수 있다.
 */
const LoginButton : React.FC<
    { handleLogin?: () => void }
> = React.memo(({handleLogin}) => {
    return (
        <Row className={`w-100 ${styles.h8}`}  style={{minWidth: "300px", maxWidth: "300px", maxHeight: "50px"}}>
            <Col className="d-flex justify-content-center">
                <Button
                    type="button"
                    className={`w-100 ${styles.h100} ${styles.borderRadius} ${styles.loginButton}`}
                    onClick={handleLogin}
                >로그인</Button>
            </Col>
        </Row>
    )
});

export const AuthMain: React.FC = () => {

    /**
     * 이걸 전부 4개의 상태로 나누면 onChange마다 2번의 렌더링이 일어난다.
     * 이걸 username,usernameError  password,passwordError로 나누거나, 하나의 객체로 다루면 1번의 렌더링이 일어난다.
     * 어차피 속성이 몇 개 없으니 하나로 다루겠다.
     */
    const handleKakaoLogin = async () => {
        await kakaoLoginRequest();
    }

    const handleNaverLogin = async () => {
        await naverLoginRequest();
    }


    return (
            <Container className={`${layout.authMainLayout} ${d.rootFont}`}>

                <Row className={`${styles.emptyTopRow}`}/>

                <Row className={`w-100 mb-4 ${styles.h15} ${styles.AdaptiveSizeForImage}`} >
                    <Col className="d-flex justify-content-center">
                        <div className={`${styles.momentLogoNTextImg}`}>
                            <MomentLogoNTextImg
                                style={{maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto"}}/>
                        </div>
                    </Col>
                </Row>
                <Row className={`${styles.emptyMiddleRow}`}/>

                <LoginArea>
                    <LoginButton/>
                </LoginArea>

                <Row className={`w-100 mb-4`} style={{fontSize: "10px", minWidth: "300px", maxWidth: "300px"}}>
                    <Col className="d-flex justify-content-end">
                        <Link to="/auth/signUp">
                            <span>회원가입</span>
                        </Link>
                        <span style={{marginLeft: "5px", marginRight: "5px"}}>|</span>
                        <Link to="/auth/emailVerification/id">
                            <span>아이디 찾기</span>
                        </Link>
                        <span style={{marginLeft: "5px", marginRight: "5px"}}>|</span>
                        <Link to="/auth/emailVerification/pwd">
                            <span>비밀번호 재설정</span>
                        </Link>
                    </Col>
                    <Link to="/" style={{fontSize: '9px', textAlign:"right"}}>
                        <span >로그인없이 사용해보기{"->"}</span>
                    </Link>
                </Row>

                <Row className={`w-100 mb-3 ${styles.h6}`}
                     style={{height: "auto", minHeight: "40px", maxHeight: "40px", minWidth: "300px" }} >
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
                                minWidth : "160px",
                                maxWidth : "160px"
                            }}
                            onClick={(e)=>handleKakaoLogin()}
                        >
                            <KakaoButtonImg
                                className={`${styles.oauthButtonImg}`}
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
                                minWidth : "160px",
                                maxWidth : "160px"
                            }}
                            onClick={(e)=>handleNaverLogin()}
                        >
                            <NaverButtonImg
                                className={`${styles.oauthButtonImg}`}
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
            </Container>
    )
}