import React, {useState} from 'react';
import {ProfileHeader} from "./component/ProfileHeader.tsx";
import {ProfilePostGrid} from "./component/ProfilePostGrid.tsx";
import {Container} from "react-bootstrap";
import {ProfileNavBar} from "./component/ProfileNavBar.tsx";
import {Footer} from "../common/components/Footer.tsx";
import {ProfilePostType} from "./component/ProfilePostType.tsx";


const Profile: React.FC = () => {

    const [selectedType, setSelectedType] = useState<string>('posts'); // 선택된 타입 저장

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
        profilePicUrl: 'path_to_profile_picture.jpg', // Replace with actual URL
        postImages: ['cat1.jpg', 'cat2.jpg', 'cat3.jpg', 'pasta.jpg'], // Replace with actual post images
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
        <Container style={styles.container}>
            <ProfileNavBar />
            <ProfileHeader
                style={styles.headerWrapper}
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
            <Footer />
        </Container>
    );
};

export default Profile;

const styles: {[key : string] : React.CSSProperties} = {
    container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100vw',
    height: '100%',
    padding: '0 0px', /* 내부 패딩 설정 */
    overflowY: 'visible',
    overflowX: 'visible',
    boxSizing: "border-box",
    position:"static",
    },
}