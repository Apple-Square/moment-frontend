import React, { useState } from 'react';
import styles from "./css/AddFeed.module.css";
import { Col, Container, Row } from 'react-bootstrap';
import ImageUploader from './components/ImageUploader';
import TextInput from './components/TextInput';

const AddFeed: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);;
    const [text, setText] = useState('');

    const handleSubmit = () => {
        if (image && text) {
            // server
            console.log('Image:', image);
            console.log('Text:', text);
        } else {
            alert('이미지와 내용을 모두 입력해주세요.');
        }
    }

    return (
        <Container className='pageContainer p-0'>
            <Row className='justify-content-center p-0'>
                <Col className='p-0' xs={12} md={8} lg={4}>
                    {/* main component */}
                    <Container className={`${styles.container} p-0`}>
                        <Row className={`p-0 m-0 ${styles.row}`}>
                            <Col className="p-0">
                                <ImageUploader onImageChange={setImage} />
                            </Col>
                        </Row>
                        <Row className={`p-0 ${styles.row} ${styles.textArea}`}>
                            <Col className="p-0">
                                <TextInput value={text} onChange={setText} />
                            </Col>
                        </Row>
                        <Row className={`p-0 ${styles.row}`}>
                            <Col className={`p-2 ${styles.buttonBox}`}>
                                <button className={styles.btn}>위치</button>
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