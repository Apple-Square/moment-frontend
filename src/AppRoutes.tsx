import {Outlet, Route, Routes} from "react-router-dom";
import {AuthMain} from "./pages/auth/AuthMain.tsx";
import {SignUp} from "./pages/auth/SignUp.tsx";
import Postcode from "./pages/auth/Postcode.tsx";
import Profile from "./pages/user/Profile.tsx";
import FindUserId from "./pages/auth/FindUserId.tsx";
import FollowList from "./pages/user/FollowList.tsx";
import PersonalInfo from "./pages/user/PersonalInfo.tsx";
import UpdatePwd from "./pages/auth/UpdatePwd.tsx";
import ChatroomList from "./pages/chat/ChatroomList.tsx";
import Chatroom from "./pages/chat/Chatroom.tsx";
import MainFeed from "./pages/feed/MainFeed.tsx";
import ThreeColumnFeedList from "./pages/feed/ThreeColumnFeedList.tsx";
import AddFeed from "./pages/feed/AddFeed.tsx";
import EmailVerification from "./pages/auth/EmailVerification.tsx";
import BackgroundTemplate from "./pages/common/components/BackgroundTemplate.tsx";
import Test from "./pages/auth/Test.tsx";
import PrivateRoute from "./PrivateRoute.tsx";
import {Footer} from "./pages/common/components/Footer.tsx";
import {Container} from "react-bootstrap";
import React from "react";
import FeedDetail from "./pages/feed/FeedDetail.tsx";
// import Moment from "./pages/feed/components/Moment.tsx";
import MomentList from "./pages/feed/components/MomentList.tsx";
import MomentScroll from "./pages/feed/MomentScroll.tsx";


export const AppRoutes: React.FC = () => {

    const AuthLayout: React.FC = () => (
        <BackgroundTemplate>
            <Container style={styles.container}>
                <Outlet />
                <Footer />
            </Container>
        </BackgroundTemplate>
    );

    return (<Routes>
        {/* <Route path="/" element={<MainFeed/>}></Route> */}
        <Route path="/" element={<MomentScroll/>}></Route>
        <Route path="/test" element={<Test/>}></Route>
        <Route path="/auth" element={<AuthLayout />}>
            <Route path="authMain" element={<AuthMain/>}></Route>
            <Route path="findUserId" element={<FindUserId/>}></Route>
            <Route path="postcode" element={<Postcode/>}></Route>
            <Route path="signUp" element={<SignUp/>}></Route>
            <Route path="updatePwd" element={<UpdatePwd/>}></Route>
            <Route path="emailVerification" element={<EmailVerification/>}></Route>
        </Route>

        <Route path="/user" element={<AuthLayout />}>
            <Route path="profile" element={<Profile/>}></Route>
            <Route path="followList" element={<FollowList/>}></Route>

            <Route path="personalInfo" element={<PrivateRoute><PersonalInfo/></PrivateRoute>}></Route>
        </Route>
        <Route path="/chat" element={<AuthLayout />}>
            <Route path="chatroomList" element={<ChatroomList/>}></Route>
            <Route path="chatroom" element={<Chatroom/>}></Route>
        </Route>
        <Route path="/feed" element={<AuthLayout />}>
            <Route path="threeColumnFeedList" element={<ThreeColumnFeedList/>}></Route>
            <Route path="feedDetail" element={<FeedDetail />}></Route>
        </Route>
        <Route path="/feed/addFeed" element={<AddFeed/>}></Route>    {/* 개별 경로 설정 */}
    </Routes>)
}

const styles: {[key : string] : React.CSSProperties} = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        flexDirection: 'column',
        maxWidth: "768px",
        width: '100vw',
        height: '100%',
        padding: '0 0px', /* 내부 패딩 설정 */
        overflowY: 'visible',
        overflowX: 'visible',
        boxSizing: "border-box",
        position:"static",
    },
}