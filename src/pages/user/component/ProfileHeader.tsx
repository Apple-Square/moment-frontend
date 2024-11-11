import React, {useRef} from 'react';
import {followCancelRequest, followRequest, UserPage, UserPagePocket} from "../function/userAxiosRequest.tsx";
import {Col, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {castError} from "../../../lib/ErrorUtil.ts";
import {Updater} from "use-immer";
import {useLoginModal} from "../../common/hook/useLoginModal.ts";
import {LoginRecommandModal} from "../../common/components/LoginRecommandModal.tsx";

type ProfileHeaderProps = {
    myId: string;
    userPage: UserPage;
    fetchAndUpdateUserData: () => Promise<void>
    // profileImage: string;//추가
    fileInputRef: React.RefObject<HTMLInputElement>;//추가
    handleImageClick: () => void;//추가
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;//추가
    handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;//추가
    style?: React.CSSProperties;
};
//추가
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
                                                                myId,
                                                                userPage,
                                                                fetchAndUpdateUserData,
                                                                // profileImage,
                                                                fileInputRef,
                                                                handleImageClick,
                                                                handleFileChange,
                                                                handleImageError,
                                                                style
                                                            }) => {



    const {
        showModal,
        handleConfirm,
        handleCancel,
        loading,
        checkAuth,
    } = useLoginModal();


    //api요청 날리고 성공하면 userPage.followed = true로 바꿔주기
    const handleFollow = async () => {
        // if (!checkAuth()) return;

        console.log('팔로우');
        try{
            const id = await followRequest(userPage.user.id);
            if(id){
                void fetchAndUpdateUserData();
            }
        } catch (error) {
            console.error(`followRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
            return castError(error);
        }
    }
    //api요청 날리고 성공하면 userPage.followed = false로 바꿔주기
    const handleFollowCancel = async () => {
        // if (!checkAuth()) return;
        console.log('팔로우 취소');

        try {
            const id = await followCancelRequest(userPage?.user?.id);
            if(id){
                void fetchAndUpdateUserData();
            }
        } catch (error) {
            console.error(`followCancelRequest에서 에러 :: ${JSON.stringify(error, null, 2)}`);
            return castError(error);
        }
    }

    const handleProfileShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: '프로필 공유하기',
                    text: '프로필 공유하기',
                    url: window.location.href,
                })
                .then(() => console.log('공유 성공'))
                .catch((error) => console.log('공유 실패:', error));
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => alert('URL이 클립보드에 복사되었습니다!'))
            .catch((error) => console.error('복사 실패:', error));
    };

    const handleMessage = async () => {
        // if (!checkAuth()) return;
        console.log('메세지');
    }

    return (
        <>
            <Row className="align-items-center w-100 m-0">
                <Col xs={4} style={{...styles.profileHeader, ...style}}>
                    <div className="d-flex flex-column align-items-center w-100">
                        <div className="mb-3 w-100 d-flex flex-column align-items-center">
                            <Image
                                src={userPage?.user?.profileImage || `${import.meta.env.BASE_URL}images/defaultProfileImage.jpg`}
                                roundedCircle
                                onError={handleImageError}
                                alt="Profile"
                                style={styles.profilePic}
                                onClick={myId === userPage?.user?.id ? handleImageClick : undefined}
                            />
                        </div>
                        <div>
                            <p style={styles.nickname}>{userPage?.user?.nickname}</p>
                        </div>
                    </div>
                </Col>
                <Col xs={8} className="d-flex align-items-center justify-content-center p-0 m-0"
                     style={{flexDirection: 'column'}}>
                    <Row className="text-center w-100 m-0" style={{padding: '0', flex: 10}}>
                        <Col xs={4}>
                            <p className="fw-bold mb-0">{userPage?.postCount}</p>
                            <p className="text-muted">게시물</p>
                        </Col>
                        <Col xs={4}>
                            <Link
                                to="/user/followRelationshipList"
                                state={{ listType: "follower", userPage }}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <p className="fw-bold mb-0">{userPage?.followerCount}</p>
                                <p className="text-muted">팔로워</p>
                            </Link>
                        </Col>
                        <Col xs={4}>
                            <Link
                                to="/user/followRelationshipList"
                                state={{ listType: "following", userPage }}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <p className="fw-bold mb-0">{userPage?.followingCount}</p>
                                <p className="text-muted">팔로잉</p>
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={styles.intro} className="w-100">
                <p>{userPage?.user?.intro}</p>
            </Row>
            {myId !== userPage?.user?.id && (
            <Row className="w-100 m-0 align-items-between" style={styles.actionLayout}>
                <button
                    style={styles.button}
                    onClick={userPage?.followed ? handleFollowCancel : handleFollow}
                >{userPage?.followed ? "팔로우 취소" : "팔로우"}</button>
                <button
                    style={styles.button}
                    onClick={handleMessage}
                >메세지</button>
            </Row>)}
            {myId === userPage?.user?.id && (
                <Row className="w-100 m-0 align-items-between" style={styles.actionLayout}>
                    <Link
                        to={"edit"}
                        state={{userPage : userPage}}
                        style={{textDecoration: 'none', color: 'inherit', width : '47%'}}
                        className="p-0"
                    >
                        <button
                            style={styles.button2}>
                            프로필 편집
                        </button>
                    </Link>
                    <span
                        style={{textDecoration: 'none', color: 'inherit', width : '47%'}}
                        className="p-0"
                    >
                    <button
                        style={styles.button2}
                        onClick={handleProfileShare}
                    >프로필 공유</button>
                    </span>
                </Row>)}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
            {showModal && (
                <LoginRecommandModal
                    open={showModal}
                    onClose={handleCancel}
                    onConfirm={handleConfirm}
                />
            )}
        </>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        margin: '0 0 0 0px',
        width: '33.33%',
    },
    profilePic: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        cursor: 'pointer', //추가
    },
    stats: {
        display: 'flex',
        gap: '1rem',
        marginTop: '0.5rem',
    },
    nickname: {
        fontSize: '1.3rem',
        fontWeight: '500',
        margin: '0',
    },
    intro: {
        padding: '1rem',
        margin: '0',
    },
    button: {
        borderRadius: '10px',
        border : '0px solid #000000',
        backgroundColor : '#ececec',
        width: '47%'
    },
    button2: {
        borderRadius: '10px',
        border : '0px solid #000000',
        backgroundColor : '#ececec',
        width: '100%'
    },
    actionLayout: {
        display: 'flex',
        flexDirection : 'row',
        justifyContent: 'space-evenly',
        padding: '1rem 0 1rem 0',
    },
    profileModifyingLayout: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
};
