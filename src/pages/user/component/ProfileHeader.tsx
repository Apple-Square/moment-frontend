import React from 'react';
import {UserPage} from "../function/userAxiosRequest.tsx";
import {Image} from "react-bootstrap";

type ProfileHeaderProps = {
    userPage : {
        user : {
            id : string,
            nickname : string,
            regDate : string,
            birth : string,
            gender : string,
            address : string,
            intro : string,
            profileImage : string,
        },
        postCount : string,
        followerCount : string,
        followingCount : string,
        followed : boolean
    }
    style?: React.CSSProperties;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userPage, style }) => {

    const handleImageError = (e) => {
        e.target.src = `${import.meta.env.BASE_URL}images/defaultProfileImage.jpg`;
    }

    return (
        <div style={{ ...styles.profileHeader, ...style }}>
            <Image
                src={userPage?.user?.profileImage || `${import.meta.env.BASE_URL}images/pikachu.jpg`}
                roundedCircle
                onError={handleImageError}
                alt="Profile" style={styles.profilePic} />
            <div>
                <h2>{userPage?.user?.nickname}</h2>
                <p>Intro: {userPage?.user?.intro}</p>
                <p>Address: {userPage?.user?.address}</p>
                <div style={styles.stats}>
                    <p>{userPage?.postCount}개의 posts</p>
                    <p>{userPage?.followerCount}개의 followers</p>
                    <p>{userPage?.followingCount}개의 following</p>
                    <p>{userPage?.followed ? "팔로잉중" : "팔로우안하는중"}</p>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
    },
    profilePic: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
    },
    stats: {
        display: 'flex',
        gap: '1rem',
        marginTop: '0.5rem',
    },
};
