import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {useAppDispatch, useAppSelector} from "./redux/store/hooks.ts";
import {setShouldRedirect} from "./redux/slices/authSlice.ts";

//게스트만 사용할 수 있는 라우터
const GuestRoute = ({ children }) => {

    const user = useAppSelector((state) => state.auth.user);
    const isAuthentificated = useAppSelector((state) => state.auth.isAuthenticated);
    const shouldRedirect = useAppSelector((state) => state.auth.shouldRedirect);
    const loading = useAppSelector((state) => state.auth.loading);//AuthLoader가 비동기요청을 처리한 후 > false
    //동적URI가 필요
    // const [uri, setUri] = useState(null);
    //초기화될때는 return 하면 안되고, AuthLoader의 useEffect가 끝난 후에 return해야함
    const [IsFirst, setIsFirst] = useState(true);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    console.log("user, isAuthentificated, isRedirected, loading, navigate, dispatch"
        + user + "" + isAuthentificated + "" + shouldRedirect + "" + loading);

    //부작용 로직이다. 렌더링은 UI에 집중하고 부작용은 useEffect에 집중
    useEffect(() => {
        console.log("@@@@ GuestRoute useEffect 시작")
        //리다이렉트를 이미 했으면 하지마 로그인 했으면
        if (isAuthentificated && user && user?.id && !shouldRedirect && !loading) {

            dispatch(setShouldRedirect(true));
            navigate("/user/profile");
        }
        setIsFirst(false);
    }, [isAuthentificated, user, shouldRedirect, navigate, dispatch]);

    if (IsFirst || loading) {
        return null;
    } else {
        return <>{children}</>;
    }
};

export default GuestRoute;
