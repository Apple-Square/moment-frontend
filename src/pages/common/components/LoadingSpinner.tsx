import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner: React.FC = () => {
  return (
    <div style={loadingStyles.container}>
      <Spinner animation="border" variant="primary" />
      <div style={loadingStyles.text}>로딩중...</div>
    </div>
  );
};

const loadingStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px', // 컨텐츠 영역 최소 높이
    padding: '2rem',
  },
  text: {
    marginTop: '1rem',
    fontSize: '1.2rem',
    color: '#555',
  },
};

export default LoadingSpinner;
