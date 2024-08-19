import React, { useState } from 'react';
import styles from "./css/AddFeed.module.css";
import { Button, Container } from 'react-bootstrap';

const AddFeed: React.FC = () => {
    const [image, setImage] = useState('');
    const [contents, setContents] = useState('');

    const handleImageUpload = () => {
        setImage(image);
    }

    const handleUpload = () => {
        setContents(contents);
    }

    return (
        <Container className={styles.container}>
            <div className={styles.imageContainer}>
                <img className={styles.uploadImage} />
            </div>
            <div className={styles.formContainer}>
                <form></form>
            </div>
            <div className={styles.buttonBox}>
                <Button>위치</Button>
                <Button>완료하기</Button>
            </div>
        </Container>
    );
};

export default AddFeed;