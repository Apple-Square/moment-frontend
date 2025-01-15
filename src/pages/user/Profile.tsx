import React, {useEffect, useState} from 'react';
import {ProfileHeader} from "./component/ProfileHeader.tsx";
import {ProfilePostGrid} from "./component/ProfilePostGrid.tsx";
import {ProfileNavBar} from "./component/ProfileNavBar.tsx";
import {ProfilePostType} from "./component/ProfilePostType.tsx";
import {useLocation} from "react-router-dom";
import {useAppSelector} from "../../redux/store/hooks.ts";
import {getProfileRequest, updateProfileImageRequest, UserPage, UserPagePocket} from "./function/userAxiosRequest.tsx";
import {useImmer} from "use-immer";
import {JSONColor} from "../../lib/deepLog.ts";
import ProfileImageCropper from "./component/ProfileImageCropper.tsx";
import useProfileImage from "./hook/useProfileImage.tsx";
import {useLoginModal, useRequireLogin} from "../common/hook/useRequireLogin.ts";
import {LoginRecommandModal} from "../common/components/LoginRecommandModal.tsx";
import {ThreeValueBoolean} from "../../interface/OtherInterface.ts";


const Profile: React.FC = () => {

    const [selectedType, setSelectedType] = useState<string>('posts'); // 보여줄 리스트의 타입 저장
    const [userPagePocket,updateUserPagePocket] = useImmer<UserPagePocket>({
        userPage : {
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
        }
    });
    const myId = useAppSelector(state => state.auth.user.id);

    const location = useLocation();


    /**
     * location.state.userId가 있음 =>타 회원 프로필사진을 클릭했을 경우
     * location.state.userId가 없고, myId 있음 => 로그인한 유저가 프로필 사진 클릭이 아닌 푸터를 통해 프로필 접근.
     * location.state.userId가 없고, myId 없음 => 로그인하지 않은 유저가 푸터를 통해 자신의 프로필 접근.
     */
    const subjectId = location.state?.userId as string || myId;


    const {
        showModal,
        setShowModal,
        handleConfirm,
        handleCancel
    } = useLoginModal();

    useEffect(() => {

        if (!subjectId) {
            setShowModal(true);
        }

    }, [subjectId]);

    const {
        isCropping,
        uploadedImage,
        fileInputRef,
        handleImageClick,
        handleImageError,
        handleFileChange,
        handleCropped,
        closeCropper
    } = useProfileImage(userPagePocket?.userPage, updateUserPagePocket,myId);

    const fetchAndUpdateUserData = async () : Promise<void> => {
        try{
            const data : UserPagePocket | Error = await getProfileRequest(subjectId);
            if (data instanceof Error) {
                console.error("프로필 정보를 가져오는 중 에러 발생:", data.message);
                return;
            }
            console.log(`프로필 정보를 가져오는 중 성공: ${JSONColor.stringify(data, null, 2)}`);
            updateUserPagePocket(draft => {
                draft.userPage = data.userPage;
            });
        } catch (error) {
            console.error("프로필 정보를 가져오는 중 에러 발생:", error);
        }
    }


    useEffect(() => {
        //유저 페이지가 있거나 subjectId가 없으면 fetch하지 않음
        // if(userPagePocket?.userPage?.user?.id !== "" || myId === ""){
        if(userPagePocket?.userPage?.user?.id !== ""){
            console.log("유저페이지가 이미 있습니다.");
            return;
        }
        if (!subjectId) {
            return;
        }
        (async ()=>await fetchAndUpdateUserData())();


    }, [userPagePocket,myId]);

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
        <>
            {showModal && (
                <LoginRecommandModal
                    open={showModal}
                    onClose={handleCancel}
                    onConfirm={handleConfirm}
                />
            )}
            {subjectId ? (
                <>
                    <ProfileNavBar myId={myId} userPage={userPagePocket?.userPage} />
                    <ProfileHeader
                        myId={myId}
                        userPage={userPagePocket?.userPage}
                        fetchAndUpdateUserData={fetchAndUpdateUserData}
                        fileInputRef={fileInputRef}
                        handleFileChange={handleFileChange}
                        handleImageClick={handleImageClick}
                        handleImageError={handleImageError}
                    />
                    {isCropping && uploadedImage && (
                        <ProfileImageCropper
                            imageSrc={uploadedImage}
                            onCropped={handleCropped}
                            onClose={closeCropper}
                        />
                    )}
                    <ProfilePostType onSelect={handleSelectType} />
                    <ProfilePostGrid posts={getPostData()} selectedType={selectedType} />
                </>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    로그인 하시면 자신의 프로필을 확인할 수 있습니다.
                </div>
            )}
        </>
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