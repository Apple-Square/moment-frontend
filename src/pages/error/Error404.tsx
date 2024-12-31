import React, { useState } from 'react';

const Error500 = () => {
    const [isHovered, setIsHovered] = useState(false);


    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#fbfbfb',
            color: '#721c24',
            fontFamily: 'Money2, sans-serif',
            textAlign: 'center',
            padding: '20px',
        },
        heading: {
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '10px',
        },
        message: {
            fontSize: '1.5rem',
            marginBottom: '20px',
        },
        button: {
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: isHovered ? '#f1a4a8' : '#f5c6cb',
            color: '#721c24',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'background-color 0.3s ease',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.heading}>404</div>
            <div style={styles.message}>
                이런! 서버에 문제가 발생했습니다.
            </div>
            <a
                href="/"
                style={styles.button}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                Go Back to Home
            </a>
        </div>
    );
};

export default Error500;
