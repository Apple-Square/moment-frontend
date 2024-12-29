import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from "./css/AddFeed.module.css";
import { Col, Container, Row } from 'react-bootstrap';
// import MediaUploader from './components/MediaUploader';
import TextInput from './components/TextInput';
import SearchPlace from './components/PlaceSearch';
import TagInput from './components/TagInput';
import UrlViewer from './components/UrlViewer';
import { getFeedIDRequest, updateFeedRequest } from './function/feedAxiosReqest';

// override AddFeed
type ContentsData = {
    text: string;
    tags: string[];
    mediaType: "IMAGE" | "VIDEO"; // Add other media types if needed
    media: string[];
    address: string;
};


const EditFeed: React.FC = () => {
    // const [media, setMedia] = useState<File[]>([]);  // 미디어 수정 금지
    const [text, setText] = useState('');
    const [placeOpen, setPlaceOpen] = useState<boolean>(false);       // '위치'버튼을 눌렀을 때 창 처리 state
    const [place, setPlace] = useState<string>('');     // 게시글에 붙는 장소 태그
    const [tagOpen, setTagOpen] = useState<boolean>(false);
    const [newTags, setNewTags] = useState<string[]>([]);
    const [origin, setOrigin] = useState<ContentsData | null>(null);

    const navi = useNavigate()

    useEffect(() => {
        const { id } = useParams<{ id: string }>();
        const nId = Number(id); // casting
        const fetchFeed = async () => {
            try {
                const response = await getFeedIDRequest(nId);
                if ('data' in response) { // AxiosResponse인지 확인
                    const media = response.data.post.urls;
                    const mediaType = response.data.post.mediaType;
                    const originText = response.data.post.content;
                    const originTags = response.data.post.tags;
                    const originAddr = response.data.post.address;
                    setOrigin({
                        text: originText,
                        tags: originTags,
                        mediaType: mediaType,
                        media: media,
                        address: originAddr
                    });
                    if (origin) {
                        setText(origin.text);
                        setNewTags(origin.tags);
                        setPlace(origin.address);
                    }


                    console.log('fetching complete.')
                } else {
                    console.error('Error fetching feeds:', response);
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        }

        fetchFeed()
    }, []);

    const handleSubmit = () => {        /* 수정하기 create -> update */
        if (text) {
            const argurls = undefined;
            const argfiles = undefined;
            const argtext = (origin?.text != text) ? text : undefined;
            const argtags = (origin?.tags != newTags) ? newTags : undefined;
            const argaddr = (origin?.address != place) ? place : undefined;
            
            updateFeedRequest(argurls, argfiles, argtext, argtags, argaddr).then(response => {
                if ('data' in response) {
                    console.log('게시글 수정 성공:', response.data);
                }
            })
                .catch(error => {
                    console.error('게시글 수정 실패:', error);
                });

            // console.log('Media:', media);
            console.log('Text:', text);
        } else {
            alert('이미지와 내용을 모두 입력해주세요.');
        }
    }

    const goBack = () => {
        navi(-1); // 이전 페이지로 이동
    };

    return (

        <Container className={`${styles.container} p-0`}>
            <Row className={`p-0 m-0 ${styles.row}`}>
                <Col className={`p-0 ${styles.topBar}`}>
                    <span className={`${styles.back}`} onClick={() => goBack()}>←</span>
                    <span>피드 수정</span>
                </Col>
            </Row>
            <Row className={`p-0 m-0 ${styles.row}`}>
                <Col className="p-0">
                    {(origin?.media) &&
                    (<UrlViewer media={origin?.media} type={origin.mediaType} />)}
                </Col>
            </Row>
            <Row className={`p-0 ${styles.row} ${styles.textArea}`}>
                <Col className="p-0">
                    <TextInput value={text} onChange={setText} />
                </Col>
            </Row>
            <Row className={`p-0 ${styles.row}`}>
                <Col className={`p-2 ${styles.buttonBox}`}>
                    {/* 위치/태그 묶을 버튼박스 새로 만들기 */}
                    <div className={`${styles.tbtnbox}`}>
                        <button className={styles.btn} onClick={() => setPlaceOpen(!placeOpen)}>위치</button>
                        {placeOpen && (
                            <div className={styles.searchPlaceContainer}>
                                <SearchPlace setPlaceOpen={setPlaceOpen} setPlace={setPlace} />
                            </div>
                        )}
                        <button className={`${styles.btn}`} onClick={() => setTagOpen(!tagOpen)}>태그</button>
                        {tagOpen && (
                            <div className={styles.tagInputContainer}>
                                <TagInput tags={newTags} setTags={setNewTags} setTagOpen={setTagOpen} />
                            </div>
                        )}
                    </div>
                    <button className={styles.btn} onSubmit={handleSubmit}>
                        수정하기
                    </button>
                </Col>
            </Row>
        </Container>

    );
};

export default EditFeed;