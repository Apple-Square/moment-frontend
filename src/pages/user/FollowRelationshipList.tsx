import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Image, Button } from 'react-bootstrap';
import {useAppSelector} from "../../redux/store/hooks.ts";
import {useImmer} from "use-immer";
import {
    FollowListPocket,
    getFollowersRequest,
    getFollowingsRequest,
    UserOfFollowList, UserPage
} from "./function/userAxiosRequest.tsx";
import Loading from "../common/components/Loading.tsx";
import {map} from "react-bootstrap/ElementChildren";
import FollowListNotFound from "./component/FollowListNotFound.tsx";
import {
    encryptData,
    decryptData, setSessionItem, getSessionItem,
} from '../../lib/crypto.ts';
import d from "../../lib/css/default.module.css";
const FollowRelationshipList: React.FC = () => {
    const location = useLocation();
    //만약에 location.state가 없다면 문제 생겼다고 알려야함

    const pageSize = 10;
    const me = useAppSelector((state) => state.auth.user);//// Redux에서 사용자 ID 가져오기
    const [listType, setListType] = useState('follower');
    const [followerListCursor, setFollowerListCursor] = useState(1);
    const [followingListCursor, setFollowingListCursor] = useState(1);
    const [loading, setLoading] = useState(false);
    const [userPage, updateUserPage] = useImmer({
        user: {
            id: '',
            nickname: '',
            profileImage: '',
            intro: '',
        },
        followerCount: 0,
        followingCount: 0,
    });
    //내 프로필에서 내가 조작할때 팔로우 카운트 변해야한다. 팔로우 카운트 fetch한 api로부터 받아야함
    const [followerList, updateFollowerList] = useImmer<FollowListPocket>({
        content: [
            {
            id: '임시1',
            nickname: '임시1',
            profileImage: '임시1',
            followed: false,
            },
            {
                id: '임시2',
                nickname: '임시2',
                profileImage: '임시2',
                followed: true,
            },
            {
                id: '임시3',
                nickname: '임시3',
                profileImage: '임시3',
                followed: false,
            }
        ],
        hasNext: false,
    });
    const [followingList, updateFollowingList] = useImmer<FollowListPocket>({
        content: [],
        hasNext: false,
    });
    const observer = useRef<IntersectionObserver | null>(null);
    //화면 이동시에 location.state가 있으면 그것을 userPage에 저장
    //location.state가 없으면 세션스토리지에서 가져와서 userPage에 저장

    useEffect(() => {
        if (location.state) {
            setListType(location.state.listType || 'follower');
            updateUserPage((draft) => {
                draft.user = location.state.user;
                draft.followerCount = location.state.followerCount;
                draft.followingCount = location.state.followingCount;
            });
        }
    }, [location.state]); // location.state가 변경될 때마다 실행

    useEffect(() => {
        if (location.state) {
            console.log("location에서 데이터를 찾았습니다.");
            setListType(location.state.listType || 'follower');
            setSessionItem('userPage', {
                user : location.state.user,
                followerCount : location.state.followerCount,
                followingCount : location.state.followingCount,
            });
            updateUserPage((draft) => {
                draft.user = location.state.user;
                draft.followerCount = location.state.followerCount;
                draft.followingCount = location.state.followingCount;
            });
        } else {
            const userPage = getSessionItem('userPage');
            if (userPage) {
                updateUserPage((draft) => {
                    draft.user = userPage.user;
                    draft.followerCount = userPage.followerCount;
                    draft.followingCount = userPage.followingCount;
                });
            } else {
                console.log("자기 프로필로 이동합니다. 데이터가 없습니다.");
                //만약 어디에도 데이터가 없다면 자기의 프로필로 이동한다. 왜냐하면 url로 치고 들어올 수도 있기 때문
                updateUserPage((draft)=>{
                    draft.user.id = me.id;
                    draft.user.nickname = me.nickname;
                    draft.user.profileImage = me.profileImage;
                    draft.user.intro = me.profileIntro;
                })

            }
        }
    }, [location.state]);




    //유저목록가져오기 함수 만들고 useEffect로 listType바뀌면 함수호출되도록 하자.

// 팔로워 목록 가져오기 함수
    const fetchFollowList = async (listType: string): Promise<FollowListPocket | null> => {
        try {
            let data: FollowListPocket | Error;

            if (listType === 'follower') {
                data = await getFollowersRequest(userPage.user.id,pageSize,followerListCursor);
                if (data instanceof Error) {
                    console.error('팔로워 목록 가져오기 실패: ', data);
                    return null;
                }
                return data;
            } else {
                data = await getFollowingsRequest(userPage.user.id,pageSize,followingListCursor);
                if (data instanceof Error) {
                    console.error('팔로잉 목록 가져오기 실패: ', data);
                    return null;
                }
                return data;
            }
        } catch (error) {
            console.error('팔로워 목록 가져오기 실패: ', error);
            return null;
        }
    };

// 왜 굳이 두개로 나눴냐면 페이지가 변하면 다시 fetch하고 update해야 하기 때문
// 처음에는 2개 다 실행된다.
    //처음에는 fetch하고 update해야지.
    useEffect(() => {
        const fetchAndUpdateFollowerList = async () => {
            if (userPage?.user?.id !== "") {
                console.log("팔로워 목록 실행");
                const data = await fetchFollowList('follower');
                if (data) {
                    console.log("팔로우목록"+data);
                    updateFollowerList(draft => {
                        draft.content.push(...data.content); // 배열에 데이터 추가
                        draft.hasNext = data.hasNext;
                    });
                }
            }
        };
        fetchAndUpdateFollowerList();
    }, [followerListCursor]);

    useEffect(() => {
        const fetchAndUpdateFollowingList = async () => {
            if (userPage?.user?.id !== "") {
                console.log("팔로잉 목록 실행");
                const data = await fetchFollowList('following');
                if (data) {
                    console.log("팔로잉목록"+data);
                    updateFollowingList(draft => {
                        draft.content.push(...data.content); // 배열에 데이터 추가
                        draft.hasNext = data.hasNext;
                    });
                }
            }
        };
        fetchAndUpdateFollowingList();
    }, [followingListCursor]);




    //팔로우 목록 보기 클릭시
    const handleFollowerClick = () => {
        setListType('follower');
    };

    //팔로잉 목록 보기 클릭시
    const handleFollowingClick = () => {
        setListType('following');
    }

    //여기서 listType은 상태를 넣어야함.
    const lastNodeElementRef = useCallback((node, listType) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if(listType==='follower') {
                if (entries[0].isIntersecting && followerList.hasNext) {
                    setFollowerListCursor((prevPage) => prevPage + 1);
                }
            } else {
                if (entries[0].isIntersecting && followingList.hasNext) {
                    setFollowingListCursor((prevPage) => prevPage + 1);
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [followerList.hasNext]);

    const handleSearchChange = () => {
        // 검색 기능 구현
        // 로대쉬 디바운스로 너무 잦은 검색은 막아야함
    }


    // 팔로워 또는 팔로잉 리스트 데이터 (여기서는 가상 데이터로 설정)

    // 피드 실행 대기중
    if (loading && (followerList.content.length === 0 || followingList.content.length === 0)) {
        return (
            <div>
                <Loading />
            </div>
        );
    }


    return (
        <div className={`${d.rootFont}`}>
            <Row className="d-flex align-items-center w-100" style={styles.header}>
                <Col xs={1} className="d-flex align-items-center justify-content-center">
                    <button onClick={() => window.history.back()}>←</button> {/* 뒤로가기 버튼 */}
                </Col>
                <Col xs={11} className={`${d.flexLeft}`}>
                    <h4 style={{margin:"0px"}}>{userPage?.user?.nickname || "유저닉네임이 없음"}</h4> {/* 유저 닉네임 */}
                </Col>
            </Row>

            <Row
                className="d-flex justify-content-around w-100 m-0"

            >
                <Col xs={6}
                     className='p-0 m-0'
                     onClick={handleFollowerClick}
                >
                    <h5
                        style={listType === 'follower' ? styles.active : styles.inactive}
                    >
                        팔로워 {userPage?.followerCount}명
                    </h5>
                </Col>
                <Col xs={6}
                     className="p-0 m-0"
                     onClick={handleFollowingClick}
                >
                <h5
                    style={listType === 'following' ? styles.active : styles.inactive}
                >
                    팔로잉 {userPage?.followingCount}명
                </h5>
                </Col>
            </Row>

            <Row
                className="w-100 m-0 p-5"
            >


                {/* 검색창 */}
                <input type="text"
                       placeholder="검색"
                       style={{ width: '100%',
                           padding: '0.5rem',
                           marginBottom: '1rem',
                           border: "1px solid #000",
                           borderRadius : "5px" }}
                       onChange={handleSearchChange}
                />
            </Row>
            {/*여기 following꺼도 해줘야햄*/}
            <Row className="w-100 m-0">
                {listType === 'follower' && (
                    !loading && followerList?.content.length === 0 ? (
                        <FollowListNotFound />
                    ) : (
                        followerList?.content.map((user: UserOfFollowList, index: number) => (
                            <Col
                                ref={lastNodeElementRef}
                                key={index}
                                 xs={12}
                                 className="d-flex align-items-center justify-content-between p-2 border-bottom">
                                <div className="d-flex align-items-center">
                                    <Image src={user.profileImage || '/images/defaultProfileImage.jpg'} roundedCircle width="50" height="50" />
                                    <div className="ms-3">
                                        <p className="fw-bold mb-0">{user.nickname}</p>
                                    </div>
                                </div>
                                <div>
                                    {me?.id !== user.id ? (
                                        user.followed ? (
                                            <>
                                                <Button variant="outline-secondary" className="me-2">메세지</Button>
                                                <Button variant="outline-danger">팔로우 취소 </Button>
                                            </>
                                        ) : (
                                            <Button variant="primary">팔로우</Button>
                                        )
                                    ) : (
                                        <Button variant="outline-secondary">자기자신</Button>
                                    )}
                                </div>
                            </Col>
                        ))
                    )
                )}

                {listType === 'following' && (
                    !loading && followingList?.content.length === 0 ? (
                        <FollowListNotFound />
                    ) : (
                        followingList?.content.map((user: UserOfFollowList, index: number) => (
                            <Col
                                ref={lastNodeElementRef}
                                key={index}
                                xs={12}
                                className="d-flex align-items-center justify-content-between p-2 border-bottom">
                                <div className="d-flex align-items-center">
                                    <Image src={user.profileImage || '/images/defaultProfileImage.jpg'} roundedCircle width="50" height="50" />
                                    <div className="ms-3">
                                        <p className="fw-bold mb-0">{user.nickname}</p>
                                    </div>
                                </div>
                                <div>
                                    {me?.id !== user.id ? (
                                        user.followed ? (
                                            <>
                                                <Button variant="outline-secondary" className="me-2">메세지</Button>
                                                <Button variant="outline-danger">팔로우 취소 </Button>
                                            </>
                                        ) : (
                                            <Button variant="primary">팔로우</Button>
                                        )
                                    ) : (
                                        <Button variant="outline-secondary">자기자신</Button>
                                    )}
                                </div>
                            </Col>
                        ))
                    )
                )}
            </Row>
        </div>
    );
};

export default FollowRelationshipList;

const styles: { [key: string]: React.CSSProperties } = {
    header : {
        margin : '3rem 0 3rem 0',

    },
    active: {
        color: 'black',
        borderBottom: '2px solid black',
        padding: '0.5rem',
        cursor: 'pointer',
        textAlign : 'center',
        fontWeight : '600',
    },
    inactive: {
        color: 'gray',
        borderBottom: '2px solid gray',
        padding: '0.5rem',
        cursor: 'pointer',
        textAlign : 'center',
        fontWeight : '600',
    },
}