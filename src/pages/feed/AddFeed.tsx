import React, { useState } from 'react';
import styles from "./css/AddFeed.module.css";
import { Col, Container, Row } from 'react-bootstrap';
import MediaUploader from './components/MediaUploader';
import TextInput from './components/TextInput';
import SearchPlace from './components/PlaceSearch';

const AddFeed: React.FC = () => {
    const [media, setMedia] = useState<File[]>([]);;
    const [text, setText] = useState('');
    const [placeTag, setPlaceTag] = useState<Boolean>(false);

    const handleSubmit = () => {
        if (media && text) {
            // server
            console.log('Media:', media);
            console.log('Text:', text);
        } else {
            alert('이미지와 내용을 모두 입력해주세요.');
        }
    }

    return (
        <Container className='pageContainer'>
            <Row className='justify-content-center p-0'>
                <Col className='p-0' xs={12} lg={8}>
                    {/* main component */}
                    <Container className={`${styles.container} p-0`}>
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
                                <button className={styles.btn} onClick={() => setPlaceTag(!placeTag)}>위치</button>
                                {placeTag && (
                                    <div className={styles.searchPlaceContainer}>
                                        <SearchPlace setPlaceTag={setPlaceTag}/>
                                    </div>
                                )}
                                <button className={styles.btn} onSubmit={handleSubmit}>
                                    완료하기
                                </button>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>

    );
};

export default AddFeed;