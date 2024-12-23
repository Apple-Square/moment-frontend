import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./css/AddFeed.module.css";
import { Col, Container, Row } from 'react-bootstrap';
import MediaUploader from './components/MediaUploader';
import TextInput from './components/TextInput';
import SearchPlace from './components/PlaceSearch';
import TagInput from './components/TagInput';

const AddFeed: React.FC = () => {
    const [media, setMedia] = useState<File[]>([]);;
    const [text, setText] = useState('');
    const [placeOpen, setPlaceOpen] = useState<boolean>(false);       // '위치'버튼을 눌렀을 때 창 처리 state
    const [place, setPlace] = useState<string>('');     // 게시글에 붙는 장소 태그
    const [tagOpen, setTagOpen] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);

    const navi = useNavigate()

    const handleSubmit = () => {
        if (media && text) {
            // server
            console.log('Media:', media);
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
                    <span>새 피드 작성</span>
                </Col>
            </Row>
            <Row className={`p-0 m-0 ${styles.row}`}>
                <Col className="p-0">
                    <MediaUploader contents={media} onMediaChange={setMedia} />
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
                                <TagInput tags={tags} setTags={setTags} setTagOpen={setTagOpen} />
                            </div>
                        )}
                    </div>
                    <button className={styles.btn} onSubmit={handleSubmit}>
                        완료하기
                    </button>
                </Col>
            </Row>
        </Container>

    );
};

export default AddFeed;