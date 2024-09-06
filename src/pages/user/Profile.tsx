import React, {useEffect} from 'react';
import Footer from "../common/components/Footer.tsx";
import {Container} from "react-bootstrap";
import st from "../user/css/profile.module.css";
import {logoutThunk} from "../../redux/slices/authSlice.ts";
import {useAppDispatch, useAppSelector} from "../../redux/store/hooks.ts";
const Profile:React.FC = () => {


    const auth = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();


    const handleClick = async () => {
        //로그아웃 - 디스패치 loginThunk 사용
        await dispatch(logoutThunk());
    }
    console.log("auth보자" + JSON.stringify(auth, null, 2));
    useEffect(() => {

    }, []);

    return (
        <Container className={`${st.container}`}>
        <Footer/>
            <button
            type="button"
            onClick={handleClick}
            >
            </button>
        </Container>
    );
};

export default Profile;