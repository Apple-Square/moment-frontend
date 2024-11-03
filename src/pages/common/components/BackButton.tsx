import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <button onClick={handleBack} style={styles.backButton}>
            <BiArrowBack style={styles.icon} />
        </button>
    );
};
export default BackButton;
const styles: { [key: string]: React.CSSProperties } = {
    backButton: {
        backgroundColor: 'transparent', // 배경 투명
        border: 'none',                 // 테두리 제거
        cursor: 'pointer',              // 커서 포인터로 변경
        display: 'flex',
        alignItems: 'center',
        padding: 0,                     // 여백 제거
    },
    icon: {
        fontSize: '24px',               // 아이콘 크기
    }
};