import React from 'react';
import Feed from './components/Feed';
import styles from "./css/FeedList.module.css";
import { Container, Row } from "react-bootstrap";

//dummy data
const feedData = [
    {
        profileImg: 'https://randomuser.me/api/portraits/men/1.jpg',
        author: 'John Doe',
        location: 'New York, USA',
        img: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
        contents: 'Exploring the beautiful streets of New York City!',
        likes: 120,
        comments: 24,
        shares: 15,
        timeAgo: '2 hours ago'
    },
    {
        profileImg: 'https://randomuser.me/api/portraits/women/2.jpg',
        author: 'Jane Smith',
        location: 'London, UK',
        img: 'https://images.unsplash.com/photo-1510270441230-ff9a5fc8aa92',
        contents: 'Had an amazing time visiting the Tower of London today.',
        likes: 89,
        comments: 19,
        shares: 7,
        timeAgo: '5 hours ago'
    },
    {
        profileImg: 'https://randomuser.me/api/portraits/men/3.jpg',
        author: 'Robert Brown',
        location: 'Sydney, Australia',
        img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
        contents: 'Surfing at Bondi Beach is an experience like no other!',
        likes: 234,
        comments: 56,
        shares: 34,
        timeAgo: '1 day ago'
    },
    {
        profileImg: 'https://randomuser.me/api/portraits/women/4.jpg',
        author: 'Emily White',
        location: 'Paris, France',
        img: 'https://images.unsplash.com/photo-1527261834078-9b37d0ed2e5f',
        contents: 'Caught the most beautiful sunset at the Eiffel Tower.',
        likes: 176,
        comments: 34,
        shares: 22,
        timeAgo: '2 days ago'
    },
    {
        profileImg: 'https://randomuser.me/api/portraits/men/5.jpg',
        author: 'Michael Lee',
        location: 'Tokyo, Japan',
        img: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9',
        contents: 'The cherry blossoms in Tokyo are breathtaking this time of year.',
        likes: 302,
        comments: 78,
        shares: 45,
        timeAgo: '3 days ago'
    }
];

const FeedList: React.FC = () => {
    return (
        <Container className={`${styles.container}`}>
            {feedData.map((feed, index) => (
                <Row key={index} className={`${styles.feedRow} p-0`}>
                    <Feed
                        profileImg={feed.profileImg}
                        author={feed.author}
                        location={feed.location}
                        img={feed.img}
                        contents={feed.contents}
                        likes={feed.likes}
                        comments={feed.comments}
                        shares={feed.shares}
                        timeAgo={feed.timeAgo}
                    />
                </Row>
            )
    )}
        </Container>

    );
};

export default FeedList;