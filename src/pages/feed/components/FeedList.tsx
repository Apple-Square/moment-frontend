import React, { useEffect, useState } from 'react';
import Feed from './Feed';
import styles from "../css/FeedList.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { deleteFeedRequest, getFeedRequest } from "../function/feedAxiosReqest";
// import { tempFeedData } from '../temp/tempData';


const FeedList: React.FC = () => {
    const [feedData, setFeedData] = useState<any[]>([]);    // useState<Feed[]>
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchFeeds = async () => {
        try {
            const response = await getFeedRequest();
            if ('data' in response) { // AxiosResponse인지 확인
                setFeedData(response.data.content);
            } else {
                console.error('Error fetching feeds:', response);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setIsLoading(false); // 로딩 상태 해제
        }
    };

    const deleteFeed = async (id) => {
        try {
            const response = await deleteFeedRequest(id);
            setFeedData(p => p.filter(feed => feed.id !== id));
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    useEffect(() => {
        fetchFeeds();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // 로딩 스피너 또는 메시지 표시
    }

    return (
        <Container className={`${styles.container} px-0`}>
            {feedData.map((feed, index) => (        // tempFeedData 적용중. 서버 테스트시 feedData로 변경 요망
                <Row key={index} className={`${styles.feedRow} px-0`}>
                    <Col className='p-0'>
                        <Feed
                            id={feed.id}
                            regDate={feed.regDate}
                            content={feed.content}
                            writer={{
                                id: feed.writer.id,
                                nickname: feed.writer.nickname,
                                profileImage: feed.writer.profileImage
                            }}
                            tags={feed.tags}
                            mediaType={feed.mediaType}
                            urls={feed.urls}
                            address={feed.address}
                            x={feed.x}
                            y={feed.y}
                            viewCount={feed.viewCount}
                            commentCount={feed.commentCount}
                            likeCount={feed.likeCount}
                            liked={feed.liked}
                            commented={feed.commented}
                            deleteFeed={deleteFeed}
                        />
                    </Col>
                </Row>
            )
            )}
            <div className={`${styles.listMargin}`}></div>
        </Container>

    );
};

export default FeedList;