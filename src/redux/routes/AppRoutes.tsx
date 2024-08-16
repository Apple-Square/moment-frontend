import {Outlet, Route, Routes} from "react-router-dom";
import {AuthMain} from "../../pages/auth/AuthMain.tsx";
import {SignUp} from "../../pages/auth/SignUp.tsx";
import Postcode from "../../pages/auth/Postcode.tsx";
import Profile from "../../pages/user/Profile.tsx";
import FindUserId from "../../pages/auth/FindUserId.tsx";
import FollowList from "../../pages/user/FollowList.tsx";
import PersonalInfo from "../../pages/user/PersonalInfo.tsx";
import UpdatePwd from "../../pages/auth/UpdatePwd.tsx";
import ChatroomList from "../../pages/chat/ChatroomList.tsx";
import Chatroom from "../../pages/chat/Chatroom.tsx";
import FeedList from "../../pages/feed/FeedList.tsx";
import ThreeColumnFeedList from "../../pages/feed/ThreeColumnFeedList.tsx";
import AddFeed from "../../pages/feed/AddFeed.tsx";
import EmailVerification from "../../pages/auth/EmailVerification.tsx";
import BackgroundTemplate from "../../pages/common/components/BackgroundTemplate.tsx";


export const AppRoutes: React.FC = () => {

    const AuthLayout: React.FC = () => (
        <BackgroundTemplate>
            <Outlet />
        </BackgroundTemplate>
    );

    return (<Routes>
        <Route path="/" element={<FeedList/>}></Route>
        <Route path="/auth" element={<AuthLayout />}>
            <Route path="authMain" element={<AuthMain/>}></Route>
            <Route path="findUserId" element={<FindUserId/>}></Route>
            <Route path="postcode" element={<Postcode/>}></Route>
            <Route path="signUp" element={<SignUp/>}></Route>
            <Route path="updatePwd" element={<UpdatePwd/>}></Route>
            <Route path="emailVerification" element={<EmailVerification/>}></Route>
        </Route>
        <Route path="/user">
            <Route path="profile" element={<Profile/>}></Route>
            <Route path="FollowList" element={<FollowList/>}></Route>
            <Route path="PersonalInfo" element={<PersonalInfo/>}></Route>
        </Route>
        <Route path="/chat">
            <Route path="chatroomList" element={<ChatroomList/>}></Route>
            <Route path="chatroom" element={<Chatroom/>}></Route>
        </Route>
        <Route path="/feed">
            <Route path="threeColumnFeedList" element={<ThreeColumnFeedList/>}></Route>
            <Route path="addFeed" element={<AddFeed/>}></Route>
        </Route>
    </Routes>)
}