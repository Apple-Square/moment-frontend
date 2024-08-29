import React from 'react';
import Footer from "../common/components/Footer.tsx";
import {Container} from "react-bootstrap";
import st from "../user/css/profile.module.css";
import {axiosTestInstance} from "../../lib/axiosInstance.ts";
import axios from "axios";
import {objectDeepDigger} from "../../lib/deepLog.ts";
const Profile:React.FC = () => {

    const handleClick = () => {
        const fetchData = async () => {
            try {
                const response = await axiosTestInstance.get('/protected-route');
                console.log(objectDeepDigger(response.data));
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(objectDeepDigger(`Error: ${error}`));
                } else {
                    console.log(('Unexpected error'));
                }
            }
        };
        fetchData();
    }

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