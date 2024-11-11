import { Col, Container, Row } from "react-bootstrap";
import styles from "../css/MomentList.module.css"
import Moment from "./Moment";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const momentData = [
    {
        profileImg: "https://via.placeholder.com/50", // 프로필 이미지
        author: "John Doe", // 작성자
        location: "New York", // 위치
        src: "https://videos.pexels.com/video-files/4057322/4057322-uhd_1440_2732_25fps.mp4",
        contents: "A beautiful day in New York!", // 내용
        likes: 150, // 좋아요 수
        comments: 12, // 댓글 수
        shares: 5, // 공유 수
        timeAgo: "2 hours ago", // 게시 시간
    },
    {
        profileImg: "https://via.placeholder.com/50",
        author: "Jane Smith",
        location: "San Francisco",
        src: "https://www.w3schools.com/html/movie.mp4",
        contents: "Sunset at the Golden Gate Bridge! so long, soooooooooooooo long contents. This is stil not the end. Because we have to test components capasite and overflow handling.",
        likes: 200,
        comments: 20,
        shares: 10,
        timeAgo: "5 hours ago",
    },
    {
        profileImg: "https://via.placeholder.com/50",
        author: "Chris Johnson",
        location: "Paris",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        contents: "Flowers blooming in the Parisian gardens.",
        likes: 75,
        comments: 5,
        shares: 2,
        timeAgo: "1 day ago",
    },
    {
        profileImg: "https://via.placeholder.com/50",
        author: "Emma Brown",
        location: "London",
        src: "https://vjs.zencdn.net/v/oceans.mp4", // 세로 방향 비디오
        contents: "Calm waves by the ocean.",
        likes: 320,
        comments: 45,
        shares: 18,
        timeAgo: "3 days ago",
    },
    {
        profileImg: "https://via.placeholder.com/50",
        author: "Liam Davis",
        location: "Tokyo",
        src: "https://videos.pexels.com/video-files/4434242/4434242-uhd_1440_2560_24fps.mp4", // 세로 방향 비디오
        contents: "Nightlife in Tokyo.",
        likes: 500,
        comments: 60,
        shares: 25,
        timeAgo: "1 week ago",
    },
    {
        profileImg: "https://via.placeholder.com/50",
        author: "Sophia Wilson",
        location: "Sydney",
        src: "https://www.w3schools.com/html/mov_bbb.mp4", // 비디오 링크
        contents: "Sunrise at Sydney Opera House.",
        likes: 450,
        comments: 35,
        shares: 22,
        timeAgo: "2 weeks ago",
    }
];

const MomentList = () => {
    return (
        <Container className={`${styles.container} px-0`}>
            <Swiper
                direction={'vertical'}
                className={`${styles.momentSlide} px-0`}
                slidesPerView={1}
            >
                {momentData.map((moment, index) => (
                    <SwiperSlide key={index}>
                        {/* <Row className={`${styles.momentRow} px-0 mx-0`}>
                            <Col className="p-0"> */}
                                <Moment
                                    profileImg={moment.profileImg}
                                    author={moment.author}
                                    location={moment.location}
                                    src={moment.src}
                                    contents={moment.contents}
                                    likes={moment.likes}
                                    comments={moment.comments}
                                    shares={moment.shares}
                                    timeAgo={moment.timeAgo}
                                />
                            {/* </Col>
                        </Row> */}
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    );
};

export default MomentList;