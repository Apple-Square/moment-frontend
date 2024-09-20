import React, {useRef} from 'react';
import {followCancelRequest, followRequest, UserPage, UserPagePocket} from "../function/userAxiosRequest.tsx";
import {Col, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {castError} from "../../../lib/ErrorUtil.ts";
import {Updater} from "use-immer";

type ProfileHeaderProps = {
    myId: string;
    userPage: {
        user: {
            id: string,
            nickname: string,
            regDate: string,
            birth: string,
            gender: string,
            address: string,
            intro: string,
            profileImage: string,
        },
        postCount: string,
        followerCount: string,
        followingCount: string,
        followed: boolean
    };
    fetchAndUpdateUserData: () => Promise<void>
    profileImage: string;//추가
    onProfileImageChange: (imageDataUrl: string) => void;//추가
    style?: React.CSSProperties;
};
//추가
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
                                                                myId,
                                                                userPage,
                                                                fetchAndUpdateUserData,
                                                                profileImage,
                                                                onProfileImageChange,
                                                                style
                                                            }) => {

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
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    //api요청 날리고 성공하면 userPage.followed = true로 바꿔주기
    const handleFollow = async () => {
        console.log('팔로우');
        try{
            const id = await followRequest(userPage?.user?.id);
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

                    {myId !== userPage?.user?.id && (<Row style={styles.actionLayout} className="p-0">
                        <button
                            style={styles.button}
                            onClick={userPage?.followed ? handleFollowCancel : handleFollow}
                        >{userPage?.followed ? "팔로우 취소" : "팔로우"}</button>
                        <button style={styles.button}>메세지</button>
                    </Row>)}
                </Col>
            </Row>
            <Row style={styles.intro}>
                <p>{userPage?.user?.intro}</p>
            </Row>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
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
        width: 'auto'
    },
    actionLayout: {
        width: '100%',
        flex: 2,
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '2rem'
    }
};
