import React, {useEffect, useState} from 'react';
import {ProfileHeader} from "./component/ProfileHeader.tsx";
import {ProfilePostGrid} from "./component/ProfilePostGrid.tsx";
import {Container} from "react-bootstrap";
import {ProfileNavBar} from "./component/ProfileNavBar.tsx";
import {Footer} from "../common/components/Footer.tsx";
import {ProfilePostType} from "./component/ProfilePostType.tsx";
import {useLocation} from "react-router-dom";
import {useAppSelector} from "../../redux/store/hooks.ts";
import {getProfileRequest, UserPage} from "./function/userAxiosRequest.tsx";
import {useImmer} from "use-immer";
import {AxiosError, AxiosResponse} from "axios";
import {JSONColor} from "../../lib/deepLog.ts";


const Profile: React.FC = () => {

    const [selectedType, setSelectedType] = useState<string>('posts'); // 선택된 타입 저장

    const location = useLocation();
    const viewerId = location.state as string || "X03EPGPnrqM34he";
    const myId = useAppSelector(state => state.auth.user.id);

    const [userPage,updateUserPage] = useImmer({
        user : {
            id : "",
            nickname : "",
            regDate : "",
            birth : "",
            gender : "",
            address : "",
            intro : "",
            profileImage : "",
        },
        postCount : "",
        followerCount : "",
        followingCount : "",
        followed: false
    })

    const fetchUserData = async () => {

        const response : AxiosResponse<UserPage> | AxiosError | Error = await getProfileRequest(viewerId);
        if (response instanceof Error || response instanceof AxiosError) {
            console.error("프로필 정보를 가져오는 중 에러 발생:", response.message);
            return;
        }
        console.log(`프로필 정보를 가져오는 중 성공: ${JSONColor.stringify(response, null, 2)}`);
        updateUserPage(draft => {
            draft.user = response.data.user;
            draft.postCount = response.data.postCount;
            draft.followerCount = response.data.followerCount;
            draft.followingCount = response.data.followingCount;
            draft.followed = response.data.followed;
        })
    }

    useEffect(() => {
        //유저 페이지가 있거나 내가 없으면 탈출
        if(userPage.user.id !== "" || myId === ""){
            return;
        }
        fetchUserData();
    }, [userPage,myId]);

    const handleSelectType = (type: string) => {
        setSelectedType(type); // 선택된 타입 업데이트
    };

    const userData = {
        username: 'hyeonjun6034',
        name: '최현준',
        bio: '아자자자자자자자',
        posts: 4,
        followers: 106,
        following: 441,
        profilePicUrl: 'path_to_profile_picture.jpg',
        postImages: [`${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,
            `${import.meta.env.BASE_URL}images/pikachu.jpg`,

        ],
        videos: ['video1.mp4', 'video2.mp4'], // 비디오 데이터 추가
        favorites: ['fav1.jpg', 'fav2.jpg'], // 즐겨찾기 데이터 추가
    };

    const getPostData = () => {
        if (selectedType === 'posts') {
            return userData.postImages; // 게시물 이미지 반환
        } else if (selectedType === 'videos') {
            return userData.videos; // 비디오 데이터 반환
        } else if (selectedType === 'favorites') {
            return userData.favorites; // 즐겨찾기 데이터 반환
        }
        return [];
    };


    return (
        // <Container style={styles.container}>
        <>
            <ProfileNavBar />
            <ProfileHeader
                // style={styles.headerWrapper}
                username={userData.username}
                name={userData.name}
                bio={userData.bio}
                posts={userData.posts}
                followers={userData.followers}
                following={userData.following}
                profilePicUrl={userData.profilePicUrl}
            />
            <ProfilePostType onSelect={handleSelectType} />
            <ProfilePostGrid posts={getPostData()} selectedType={selectedType} />
        </>
        // </Container>
    );
};

export default Profile;

// const styles: {[key : string] : React.CSSProperties} = {
//     container: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'stretch',
//     flexDirection: 'column',
//     maxWidth: "768px",
//     width: '100vw',
//     height: '100%',
//     padding: '0 0px', /* 내부 패딩 설정 */
//     overflowY: 'visible',
//     overflowX: 'visible',
//     boxSizing: "border-box",
//     position:"static",
//     },
// }