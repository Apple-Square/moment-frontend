import ThumbnailFeed from "./ThumbnailFeed";
import styles from '../css/ThumbnailFeedList.module.css';
import { Col, Container, Row } from "react-bootstrap";

// 20 dummies
const dummyData = [
    {
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGZvcmVzdHxlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 120,
        comments: 45,
        shares: 12,
    },
    {
        img: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJlYWNoJTIwYXQlMjBzdW5zZXR8ZW58MHx8fHwxNjI3MTM2ODIw&ixlib=rb-1.2.1&q=80&w=400',
        likes: 95,
        comments: 34,
        shares: 8,
    },
    {
        img: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDN8fG1vdW50YWluc3xlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 75,
        comments: 20,
        shares: 5,
    },
    {
        img: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDR8fGRlc2VydCUyMGxhbmRzY2FwZXxlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 200,
        comments: 60,
        shares: 25,
    },
    {
        img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fHRyZWUlMjBsaWdodGluZ3xlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 180,
        comments: 50,
        shares: 22,
    },
    {
        img: 'https://images.unsplash.com/photo-1519817914152-22f32b56fc8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDZ8fGRlc2VydCUyMHNreXxlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 140,
        comments: 40,
        shares: 15,
    },
    {
        img: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDd8fGNsYXNzcm9vbXxlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 160,
        comments: 42,
        shares: 18,
    },
    {
        img: 'https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDh8fHBhdGglMjB0byUyMHRoZSUyMGJlYWNoJTIwYXR8ZW58MHx8fHwxNjI3MTM2ODIw&ixlib=rb-1.2.1&q=80&w=400',
        likes: 210,
        comments: 65,
        shares: 30,
    },
    {
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDl8fHdpbnRlciUyMHNub3clMjBmb3Jlc3R8ZW58MHx8fHwxNjI3MTM2ODIw&ixlib=rb-1.2.1&q=80&w=400',
        likes: 130,
        comments: 38,
        shares: 10,
    },
    {
        img: 'https://images.unsplash.com/photo-1532361140589-8eb35fe5afeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxtb3VudGFpbiUyMHJpdmVyfGVufDB8fHx8MTYyNzEzNjgyMA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 85,
        comments: 25,
        shares: 7,
    },
    {
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGZvcmVzdHxlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 120,
        comments: 45,
        shares: 12,
    },
    {
        img: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJlYWNoJTIwYXQlMjBzdW5zZXR8ZW58MHx8fHwxNjI3MTM2ODIw&ixlib=rb-1.2.1&q=80&w=400',
        likes: 95,
        comments: 34,
        shares: 8,
    },
    {
        img: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDN8fG1vdW50YWluc3xlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 75,
        comments: 20,
        shares: 5,
    },
    {
        img: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDR8fGRlc2VydCUyMGxhbmRzY2FwZXxlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 200,
        comments: 60,
        shares: 25,
    },
    {
        img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fHRyZWUlMjBsaWdodGluZ3xlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 180,
        comments: 50,
        shares: 22,
    },
    {
        img: 'https://images.unsplash.com/photo-1519817914152-22f32b56fc8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDZ8fGRlc2VydCUyMHNreXxlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 140,
        comments: 40,
        shares: 15,
    },
    {
        img: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDd8fGNsYXNzcm9vbXxlbnwwfHx8fDE2MjcxMzY4MjA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 160,
        comments: 42,
        shares: 18,
    },
    {
        img: 'https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDh8fHBhdGglMjB0byUyMHRoZSUyMGJlYWNoJTIwYXR8ZW58MHx8fHwxNjI3MTM2ODIw&ixlib=rb-1.2.1&q=80&w=400',
        likes: 210,
        comments: 65,
        shares: 30,
    },
    {
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDl8fHdpbnRlciUyMHNub3clMjBmb3Jlc3R8ZW58MHx8fHwxNjI3MTM2ODIw&ixlib=rb-1.2.1&q=80&w=400',
        likes: 130,
        comments: 38,
        shares: 10,
    },
    {
        img: 'https://images.unsplash.com/photo-1532361140589-8eb35fe5afeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxtb3VudGFpbiUyMHJpdmVyfGVufDB8fHx8MTYyNzEzNjgyMA&ixlib=rb-1.2.1&q=80&w=400',
        likes: 85,
        comments: 25,
        shares: 7,
    },
];

const ThumbnailFeedList = () => {
    const field = [];

    for (let i = 0; i < dummyData.length; i += 3) {
        const items = dummyData.slice(i, i + 3);

        while (items.length < 3) {
            items.push({ img: '', likes: 0, comments: 0, shares: 0 }); // 빈 데이터를 채워 넣음
        }

        field.push(
            <Row className={`${styles.thumbRow} p-0 m-0`} key={i}>
                {items.map((item, idx) => (
                    <Col key={idx} className="p-0 m-0">
                        {item.img ? (
                            <ThumbnailFeed
                                img={item.img}
                                likes={item.likes}
                                comments={item.comments}
                                shares={item.shares}
                            />
                        ) : (
                            <div className={styles.emptyCol} />
                        )}
                    </Col>
                ))}
            </Row>
        );
    }


    return (
        <Container className={`${styles.thumbContainer} p-0`}>
            {field}
        </Container>
    );
};

export default ThumbnailFeedList;