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


const Profile: React.FC = () => {

    const [selectedType, setSelectedType] = useState<string>('posts'); // 보여줄 리스트의 타입 저장
    const [isCropping, setIsCropping] = useState(false); // 크롭 모드 제어
    const [uploadedImage, setUploadedImage] = useState<string | null>(null); // 업로드된 이미지
    const [userPagePocket,updateUserPagePocket] = useImmer({
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

    const location = useLocation();
    const viewerId = location.state as string || "X03EPGPnrqM34he";
    const myId = useAppSelector(state => state.auth.user.id);

    const handleProfileImageChange = (imageDataUrl: string) => {
        setUploadedImage(imageDataUrl);
        setIsCropping(true);
    };

    const handleCropped = async (croppedImageBlob: Blob) => {
        try {
            console.log("한번보자 :: " + JSON.stringify(myId, null, 2));
            console.log("Cropped Blob: ", croppedImageBlob);

            // Blob 객체를 updateProfileImageRequest로 전송
            const response = await updateProfileImageRequest(croppedImageBlob, myId);

            if (response instanceof Error) {
                console.error("프로필 이미지 업데이트 실패: ", response);
                return;
            }

            setIsCropping(false); // 크롭 모드 종료
            updateUserPagePocket(draft => {
                // Blob을 서버에서 저장한 URL로 교체
                draft.userPage.user.profileImage = URL.createObjectURL(croppedImageBlob); // 임시로 Blob URL 사용
            });
        } catch (error) {
            console.error("handleCropped에서 에러 발생: ", error);
        }
    };


    //모달 닫기 함수
    const closeCropper = () => {
        setIsCropping(false);
    }

    //크롭 모드일 때 body 스크롤 막기
    useEffect(() => {
        if (isCropping) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isCropping]);



    const fetchAndSetUserData = async () : Promise<void> => {
    try{
        const data : UserPagePocket | Error = await getProfileRequest(viewerId);
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

    //테스트용 삭제
    useEffect(()=>{
        console.log(JSON.stringify(userPagePocket, null, 2));
    })
    useEffect(() => {
        //유저 페이지가 있거나 내가 없으면 탈출
        if(userPagePocket?.userPage?.user?.id !== "" || myId === ""){
            return;
        }
        void fetchAndSetUserData();
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
        // <Container style={styles.container}>
        <>
            <ProfileNavBar />
            <ProfileHeader
                // style={styles.headerWrapper}
                userPage={userPagePocket?.userPage}
                profileImage={userPagePocket?.userPage?.user?.profileImage}
                onProfileImageChange={handleProfileImageChange}
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