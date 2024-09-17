import React, {useRef} from 'react';
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
    };
    profileImage: string;//추가
    onProfileImageChange: (imageDataUrl: string) => void;//추가
    style?: React.CSSProperties;
};
//추가
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userPage,profileImage, onProfileImageChange , style }) => {

    //추가
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * 이미지를 클릭하면 input type='file'을 클릭하도록 하는 함수
     */
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    /**
     * input type='file'이 클릭되었을때 실행된다.
     * 파일을 읽을 시 onload가 실행된다. 여기서 상태(uploadedImage)에 저장하고, 크롭중으로 만든다.
     * @param e
     */
    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    onProfileImageChange(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    const handleImageError = (e) => {
        e.target.src = `${import.meta.env.BASE_URL}images/defaultProfileImage.jpg`;
    }

    return (
        <div style={{ ...styles.profileHeader, ...style }}>
            <Image
                src={userPage?.user?.profileImage || `${import.meta.env.BASE_URL}images/defaultProfileImage.jpg`}
                roundedCircle
                onError={handleImageError}
                alt="Profile"
                style={styles.profilePic}
                onClick={handleImageClick}
            />
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
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
        cursor : 'pointer', //추가
    },
    stats: {
        display: 'flex',
        gap: '1rem',
        marginTop: '0.5rem',
    },
};
