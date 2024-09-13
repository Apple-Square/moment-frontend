import React from 'react';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { BsGear, BsPlusCircle } from 'react-icons/bs'; // 부트스트랩 아이콘 사용
import st from "../css/profileNavbar.module.css";
export const ProfileNavBar: React.FC = () => {
    return (
        <Navbar
            bg="light"
            expand={false}
            className={`${st.navbarTop}`}
        >
            <Container
                fluid
                style={styles.container}
            >
                {/* 왼쪽 아이콘 */}
                <Navbar.Brand
                    href="#home"
                    style={styles.navbarBrand}
                >
                    guswnsrn527
                </Navbar.Brand>


                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto mx-auto">
                        <Nav.Link href="#profile">즐겨찾기</Nav.Link>
                        <Nav.Link href="#stories">로그아웃</Nav.Link>
                    </Nav>
                </Navbar.Collapse>

                {/* 오른쪽 아이콘 */}

            </Container>
        </Navbar>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    navbarBrand : {
        marginLeft : '5px',
    },
    container : {
        padding: '0',
    }
}