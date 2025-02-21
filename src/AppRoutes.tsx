import { Outlet, Route, Routes } from "react-router-dom";
import { AuthMain } from "./pages/auth/AuthMain.tsx";
import { SignUp } from "./pages/auth/SignUp.tsx";
import Postcode from "./pages/auth/Postcode.tsx";
import Profile from "./pages/user/Profile.tsx";
import FindUserId from "./pages/auth/FindUserId.tsx";
import FollowRelationshipList from "./pages/user/FollowRelationshipList.tsx";
import ResetPwd from "./pages/auth/UpdatePwd.tsx";
import ChatroomList from "./pages/chat/ChatroomList.tsx";
import Chatroom from "./pages/chat/Chatroom.tsx";
import MainFeed from "./pages/feed/MainFeed.tsx";
import ThreeColumnFeedList from "./pages/feed/ThreeColumnFeedList.tsx";
import AddFeed from "./pages/feed/AddFeed.tsx";
import EmailVerification from "./pages/auth/EmailVerification.tsx";
import BackgroundTemplate from "./pages/common/components/BackgroundTemplate.tsx";
import Test from "./pages/auth/Test.tsx";
import PrivateRoute from "./PrivateRoute.tsx";
import { Footer } from "./pages/common/components/Footer.tsx";
import { Container } from "react-bootstrap";
import React from "react";
import {FooterLayout} from "./pages/common/layoutComponents/FooterLayout.tsx";
import ProfileEdit from "./pages/user/ProfileEdit.tsx";
import FeedDetail from "./pages/feed/FeedDetail.tsx";
// import Moment from "./pages/feed/components/Moment.tsx";
import MomentList from "./pages/feed/components/MomentList.tsx";
import MomentScroll from "./pages/feed/MomentScroll.tsx";
import Error500 from "./pages/error/Error500.tsx";
import Error404 from "./pages/error/Error404.tsx";


export const AppRoutes: React.FC = () => {

    // const AuthLayout: React.FC = () => (
    //     <BackgroundTemplate>
    //         <Container style={styles.container}>
    //             <Outlet />
    //             <Footer />
    //         </Container>
    //     </BackgroundTemplate>
    // );

    const BackgroundEffect: React.FC = () => (
        <BackgroundTemplate>
            <Outlet />
        </BackgroundTemplate>
    );


    return (<Routes>
        <Route path="/" element={<MainFeed/>}></Route>
        <Route path="/test" element={<Test/>}></Route>
        <Route path="/error">
            <Route path="500" element={<Error500/>}></Route>
            <Route path="404" element={<Error404/>}></Route>
        </Route>
        <Route path="/auth" element={<BackgroundEffect />}>
            <Route path="authMain" element={<AuthMain/>}></Route>
            <Route path="findUserId" element={<FindUserId/>}></Route>
            <Route path="postcode" element={<Postcode/>}></Route>
            <Route path="signUp" element={<SignUp/>}></Route>
            <Route path="reset-password" element={<ResetPwd/>}></Route>
            <Route path="emailVerification/:type" element={<EmailVerification/>}></Route>
        </Route>
        <Route path="/user" element={<BackgroundEffect />}>
            <Route path="profile" element={
                <FooterLayout>
                    <Profile/>
                </FooterLayout>
            }></Route>
            <Route path="profile/edit" element={
                <FooterLayout>
                    <ProfileEdit/> {/* 프로필 편집 컴포넌트 */}
                </FooterLayout>
            } />
            <Route path="followRelationshipList" element={
                    <FollowRelationshipList/>
            }></Route>

        </Route>

        <Route path="/chat">
            <Route path="chatroomList" element={<ChatroomList/>}></Route>
            <Route path="chatroom" element={<Chatroom/>}></Route>
        </Route>
        <Route path="/feed">
            <Route path="threeColumnFeedList" element={
                <FooterLayout>
                    <ThreeColumnFeedList/>
                </FooterLayout>}>
            </Route>
            <Route path="feedDetail" element={
                <FooterLayout>
                    <FeedDetail />
                </FooterLayout>
            }></Route>
        </Route>
        <Route path="/moment" element={<MomentScroll />}></Route>
        <Route path="/feed/addFeed" element={<AddFeed />}></Route>    {/* 개별 경로 설정 */}
    </Routes>)
}

// const styles: {[key : string] : React.CSSProperties} = {
//     container: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'stretch',
//         flexDirection: 'column',
//         maxWidth: "768px",
//         width: '100vw',
//         height: '100%',
//         padding: '0 0px', /* 내부 패딩 설정 */
//         overflowY: 'visible',
//         overflowX: 'visible',
//         boxSizing: "border-box",
//         position:"static",
//     },
// }