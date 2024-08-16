import React from 'react';
import Footer from "../common/components/Footer.tsx";
import {Container} from "react-bootstrap";
import st from "../user/css/profile.module.css";
const Profile:React.FC = () => {
    return (
        <Container className={`${st.container}`}>
        <Footer/>
        </Container>
    );
};

export default Profile;