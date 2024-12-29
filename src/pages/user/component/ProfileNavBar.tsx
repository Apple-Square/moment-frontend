import React, {useEffect} from 'react';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { BsGear, BsPlusCircle } from 'react-icons/bs'; // 부트스트랩 아이콘 사용
import st from "../css/profileNavbar.module.css";
import {logoutRequest} from "../../auth/function/authAxios.ts";
import {useAppDispatch} from "../../../redux/store/hooks.ts";
import {logoutThunk} from "../../../redux/slices/authSlice.ts";
import {Link, useNavigate} from "react-router-dom";
import {UserPage} from "../function/userAxiosRequest.tsx";

type ProfileNavBarProps = {
    myId : string
    userPage : UserPage;
}

export const ProfileNavBar: React.FC<ProfileNavBarProps> = ({
                                                    myId,
                                                    userPage
                                                            }) => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const handleLogout = async () => {
        await dispatch(logoutThunk());
        navigate('/auth/authMain');
    }


    useEffect(()=> {
        console.log("확인하자 :: " + JSON.stringify(userPage, null, 2) + " 그리고 " +myId)
    }, [myId, userPage])

    return (
        <Navbar
            bg="light"
            expand={false}
            className={`${st.navbarTop}`}
        >
            <Container
                style={styles.container}
            >

                <Navbar.Brand
                    href="#home"
                    className="mx-auto"
                    style={styles.navbarBrand}
                >
                    프로필 탭
                </Navbar.Brand>


                <Navbar.Toggle aria-controls="basic-navbar-nav" style={styles.navbarToggle} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto mx-auto">
                        <Nav.Link href="#profile">즐겨찾기</Nav.Link>
                        { myId === userPage?.user.id &&
                            <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>

                {/* 오른쪽 아이콘 */}

            </Container>
        </Navbar>
    );
};

const styles: { [key: string]: React.CSSProperties } =   {
    navbarBrand : {
        marginLeft : '5px',
    },
    container : {
        padding: '0',
    },
    navbarToggle : {
        marginRight : '1rem'
        // position : 'fixed',
        // inset: '10px 10px auto auto',
        // top:"10px",
        // right : '10px',
    }
}