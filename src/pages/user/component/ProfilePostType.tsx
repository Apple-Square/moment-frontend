import React from 'react';
import { BsFillFileTextFill, BsFillGridFill, BsHeartFill } from 'react-icons/bs'; // React Icons 사용

type ProfilePostTypeProps = {
    onSelect: (type: string) => void; // 선택된 타입에 따라 처리할 함수
};

export const ProfilePostType: React.FC<ProfilePostTypeProps> = ({ onSelect }) => {
    return (
        <div style={styles.container}>
            {/* 게시물 타입 선택 버튼들 */}
            <button style={styles.iconButton} onClick={() => onSelect('posts')}>
                <BsFillFileTextFill size={30} />
            </button>
            <button style={styles.iconButton} onClick={() => onSelect('videos')}>
                <BsFillGridFill size={30} />
            </button>
            <button style={styles.iconButton} onClick={() => onSelect('favorites')}>
                <BsHeartFill size={30} />
            </button>
        </div>
    );
};

// 스타일 정의
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'space-around', // 아이콘 사이의 균등한 간격
        alignItems: 'center', // 세로 중앙 정렬
        padding: '1rem 0', // 상하 간격 추가
        borderBottom: '1px solid #ccc', // 하단에 구분선 추가
        margin: '1rem 0', // 상하 여백
    },
    iconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#333',
    },
};
