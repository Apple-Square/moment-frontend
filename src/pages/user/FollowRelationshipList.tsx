import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Image, Button } from 'react-bootstrap';
import {useAppSelector} from "../../redux/store/hooks.ts";
import {useImmer} from "use-immer";
import {
    FollowListPocket, followRequest,
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
import style from "./css/FollowRelationshipList.module.css";
import LoadingSpinner from '../common/components/LoadingSpinner.tsx';
import { Footer } from "../common/components/Footer";

const FollowRelationshipList: React.FC = () => {

    const location = useLocation();
    const pageSize = 10;
    const me = useAppSelector((state) => state.auth.user);//// Redux에서 사용자 ID 가져오기
    const [listType, setListType] = useState<'follower' | 'following'>('follower');
    const [followerListCursor, setFollowerListCursor] = useState<number>(0);
    const [followingListCursor, setFollowingListCursor] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [loadingFollower, setLoadingFollower] = useState(false);
    const [loadingFollowing, setLoadingFollowing] = useState(false);
    const [userPage, updateUserPage] = useImmer<UserPage>({
        user: {
            id: '',
            nickname: '',
            profileImage: '',
            intro: '',
        },
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        followed: false,
    });
    //내 프로필에서 내가 조작할때 팔로우 카운트 변해야한다. 팔로우 카운트 fetch한 api로부터 받아야함
    const [followerList, updateFollowerList] = useImmer<FollowListPocket>({
        content: [],
        hasNext: true,
    });
    const [followingList, updateFollowingList] = useImmer<FollowListPocket>({
        content: [],
        hasNext: true,
    });
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [nextFollowerCursor, setNextFollowerCursor] = useState<number | null>(null);
    const [nextFollowingCursor, setNextFollowingCursor] = useState<number | null>(null);
    //화면 이동시에 location.state가 있으면 그것을 userPage에 저장
    //location.state가 없으면 세션스토리지에서 가져와서 userPage에 저장

    const [followerListFetched, setFollowerListFetched] = useState(false);
    const [followingListFetched, setFollowingListFetched] = useState(false);

    const updateUserPageData = (userData, followerCount, followingCount) => {
        updateUserPage((draft) => {
            draft.user = userData;
            draft.followerCount = followerCount;
            draft.followingCount = followingCount;
        });
    };

    useEffect(() => {
        console.log("useEffect 시작");
        console.log("location.state:", location.state ? "YES" : "NO");

        if (location.state) {
            console.log("location에서 데이터를 찾았습니다.");
            console.log("location.state.userPage.user:", location.state.userPage.user ? "YES" : "NO");
            setListType(location.state.listType || 'follower');
            setSessionItem('userPage', {
                user: location.state.userPage.user,
                followerCount: location.state.userPage.followerCount,
                followingCount: location.state.userPage.followingCount,
            });
            updateUserPageData(location.state.userPage.user, location.state.userPage.followerCount, location.state.userPage.followingCount);
        } else {
            const userPage = getSessionItem('userPage');
            console.log("세션에서 가져온 userPage:", userPage);

            if (userPage) {
                updateUserPageData(userPage.user, userPage.followerCount, userPage.followingCount);
            } else if (me) {
                console.log("me 데이터 사용");
                console.log("me:", me);
                updateUserPage((draft) => {
                    draft.user.id = me.id;
                    draft.user.nickname = me.nickname;
                    draft.user.profileImage = me.profileImage;
                    draft.user.intro = me.profileIntro;
                });
            }
        }
    }, [location.state, me]);

    useEffect(() => {
        console.log("userPage 상태 변경:", userPage.user.id ? "YES" : "NO");
    }, [userPage]);

    //유저목록가져오기 함수 만들고 useEffect로 listType바뀌면 함수호출되도록 하자.

// 팔로워 목록 가져오기 함수
    const fetchFollowList = async (type: 'follower' | 'following'): Promise<FollowListPocket | null> => {
        try {
            console.log(`fetchFollowList 함수 시작 - listType: ${type}`);
            let data: FollowListPocket | Error;

            if (!userPage) {
                console.log("userPage가 정의되지 않았습니다.");
                return null;
            }

            if (type === 'follower') {
                console.log("팔로워 목록 요청");
                data = await getFollowersRequest(userPage.user.id, pageSize, followerListCursor);
            } else {
                console.log("팔로잉 목록 요청");
                data = await getFollowingsRequest(userPage.user.id, pageSize, followingListCursor);
            }

            if (data instanceof Error) {
                console.error('목록 가져오기 실패: ', data);
                return null;
            }

            console.log("목록 가져오기 성공:", data);
            return data;
        } catch (error) {
            console.error('목록 가져오기 실패: ', error);
            return null;
        }
    };

    // 두개로 나눈 이유 : 페이지가 변하면 다시 fetch하고 update해야 하기 때문
    // 처음에는 2개 다 실행된다 처음에는 fetch하고 update해야 한다.
    

    // 공통: 최소 2초 로딩을 위한 헬퍼 함수
    const withMinLoadingTime = async (startTime: number) => {
        const elapsed = Date.now() - startTime;
        if (elapsed < 2000) {
        await new Promise(resolve => setTimeout(resolve, 2000 - elapsed));
        }
    };

    // 팔로워 목록 업데이트 (useCallback으로 메모이제이션)
// 팔로워 목록 업데이트 (useCallback으로 메모이제이션)
const fetchAndUpdateFollowerList = useCallback(async () => {
  if (!userPage.user.id) return;
  if (loadingFollower) return;
  // 콘텐츠가 이미 있고 더 이상 가져올 데이터가 없으면 fetch하지 않음.
  if (followerList.content.length > 0 && !followerList.hasNext) return;

  console.log(followerList.content.length);
  console.log(followerList.hasNext);
  console.log("팔로워 목록 실행");
  setLoadingFollower(true);
  const startTime = Date.now();
  const data = await fetchFollowList('follower');

  if (data) {
    if (data.content.length > 0) {
      updateFollowerList((draft) => {
        draft.content.push(...data.content);
        // API가 전달한 hasNext 값으로 업데이트 (마지막 페이지인 경우 false)
        draft.hasNext = data.hasNext;
      });
      const lastItem = data.content[data.content.length - 1];
      setFollowerListCursor(lastItem.followId);
      setNextFollowerCursor(lastItem.followId);
      // 데이터가 추가된 경우에만 최소 로딩 시간을 기다림
      await withMinLoadingTime(startTime);
    } else {
      // 추가 데이터가 없으면 바로 hasNext를 false 처리
      updateFollowerList((draft) => {
        draft.hasNext = false;
      });
    }
  }
  setLoadingFollower(false);
}, [
  userPage.user.id,
  followerList.content,
  followerList.hasNext, // 최신 hasNext 값을 반영
  loadingFollower,
  updateFollowerList,
  fetchFollowList,
]);

// 팔로잉 목록 업데이트 (useCallback으로 메모이제이션)
const fetchAndUpdateFollowingList = useCallback(async () => {
  if (!userPage.user.id) return;
  if (loadingFollowing) return;
  if (followingList.content.length > 0 && !followingList.hasNext) return;

  console.log("팔로잉 목록 실행");
  setLoadingFollowing(true);
  const startTime = Date.now();
  const data = await fetchFollowList('following');

  if (data) {
    if (data.content.length > 0) {
      updateFollowingList((draft) => {
        draft.content.push(...data.content);
        draft.hasNext = data.hasNext;
      });
      const lastItem = data.content[data.content.length - 1];
      setFollowingListCursor(lastItem.followId);
      setNextFollowingCursor(lastItem.followId);
      await withMinLoadingTime(startTime);
    } else {
      updateFollowingList((draft) => {
        draft.hasNext = false;
      });
    }
  }
  setLoadingFollowing(false);
}, [
  userPage.user.id,
  followingList.content,
  followingList.hasNext, // 최신 hasNext 값을 반영
  loadingFollowing,
  updateFollowingList,
  fetchFollowList,
]);



    useEffect(() => {
        console.log("useEffect for followers 실행");
        console.log("userPage?.user?.id:", userPage?.user?.id);
        console.log("followerList.hasNext:", followerList.hasNext);
        console.log("loadingFollower:", loadingFollower);
        console.log("followerListFetched:", followerListFetched);

        if (userPage?.user?.id && followerList.hasNext && !loadingFollower && !followerListFetched) {
            console.log("@@@@@@@@@@@@@@@@@@@fetchAndUpdateFollowerList 실행");
            fetchAndUpdateFollowerList();
            setFollowerListFetched(true);
        }
    }, [userPage?.user?.id, followerListFetched]);

    useEffect(() => {
        console.log("useEffect for followings 실행");
        console.log("userPage?.user?.id:", userPage?.user?.id);
        console.log("followingList.hasNext:", followingList.hasNext);
        console.log("loadingFollowing:", loadingFollowing);
        console.log("followingListFetched:", followingListFetched);

        if (userPage?.user?.id && followingList.hasNext && !loadingFollowing && !followingListFetched) {
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@fetchAndUpdateFollowingList 실행");
            fetchAndUpdateFollowingList();
            setFollowingListFetched(true);
        }
    }, [userPage?.user?.id, followingListFetched]);
    
  
    //팔로우 목록 보기 클릭시
    const handleFollowerClick = () => {
        setListType('follower');
    };

    //팔로잉 목록 보기 클릭시
    const handleFollowingClick = () => {
        setListType('following');
    }


    const handleSearchChange = () => {
        // 검색 기능 구현
        // 디바운스로 너무 잦은 검색은 막아야함
    }

    // 피드 실행 대기중
    if (loading && (followerList.content.length === 0 || followingList.content.length === 0)) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    // 스크롤 이벤트를 통해 무한스크롤 구현
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 50
            ) {
                if (listType === 'follower') {
                    if (
                        followerList.hasNext &&
                        !loadingFollower
                    ) {
                        console.log("스크롤 bottom 도달 → fetchAndUpdateFollowerList 실행");
                        fetchAndUpdateFollowerList();
                    }
                } else if (listType === 'following') {
                    if (
                        followingList.hasNext &&
                        !loadingFollowing
                    ) {
                        console.log("스크롤 bottom 도달 → fetchAndUpdateFollowingList 실행");
                        fetchAndUpdateFollowingList();
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [
        listType,
        followerList.hasNext,
        loadingFollower,
        followingList.hasNext,
        loadingFollowing,
        fetchAndUpdateFollowerList,
        fetchAndUpdateFollowingList,
    ]);

    return (
        <>
            <div className={`${d.rootFont}`} style={{ ...styles.container, paddingBottom: '60px' }}>
                <div style={{ padding: '1rem' }}>
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
                    <Row className="w-100 m-0">
  {listType === 'follower' && (
    <>
      {loadingFollower ? (
        // 로딩 중에는 목록 대신 스피너만 렌더링
        <LoadingSpinner />
      ) : (
        // 로딩이 끝났으면 목록 데이터를 렌더링
        followerList.content.length === 0 ? (
          <FollowListNotFound />
        ) : (
          followerList.content.map((user: UserOfFollowList, index: number) => (
            <Col
              key={index}
              xs={12}
              className="d-flex align-items-center justify-content-between p-2 border-bottom"
            >
              <div className="d-flex align-items-center">
                <Image
                  src={user.profileImage || '/images/defaultProfileImage.jpg'}
                  roundedCircle
                  width="50"
                  height="50"
                />
                <div className="ms-3">
                  <p className="fw-bold mb-0">{user.nickname}</p>
                </div>
              </div>
              <div>
                {me?.id !== String(user.followId) ? (
                  user.followed ? (
                    <>
                      <Button variant="outline-secondary" className="me-2">
                        메세지
                      </Button>
                      <Button variant="outline-danger">팔로우 취소</Button>
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
    </>
  )}

  {listType === 'following' && (
    <>
      {loadingFollowing ? (
        <LoadingSpinner />
      ) : (
        followingList.content.length === 0 ? (
          <FollowListNotFound />
        ) : (
          followingList.content.map((user: UserOfFollowList, index: number) => (
            <Col
              key={index}
              xs={12}
              className="d-flex align-items-center justify-content-between p-2 border-bottom"
            >
              <div className="d-flex align-items-center">
                <Image
                  src={user.profileImage || '/images/defaultProfileImage.jpg'}
                  roundedCircle
                  width="50"
                  height="50"
                />
                <div className="ms-3">
                  <p className="fw-bold mb-0">{user.nickname}</p>
                </div>
              </div>
              <div>
                {me?.id !== String(user.followId) ? (
                  user.followed ? (
                    <>
                      <Button variant="outline-secondary" className="me-2">
                        메세지
                      </Button>
                      <Button variant="outline-danger">팔로우 취소</Button>
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
    </>
  )}
</Row>

                </div>
            </div>
            <Footer />
        </>
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
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    footer: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        height: '50px',
        backgroundColor: '#f8f9fa',
        textAlign: 'center',
        lineHeight: '50px',
        zIndex: 1000,
    },
}