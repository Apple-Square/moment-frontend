import React, { useState, useEffect } from 'react';
import { Footer } from '../common/components/Footer';

///////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////

// 로딩 스피너 컴포넌트
const LoadingSpinner = () => {
  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <strong>Loading...</strong>
    </div>
  );
};

///////////////////////////////////////////////////////////////////////////////////////

// 무한스크롤 구현 컴포넌트
const InfiniteScrollList = () => {
  const [items, setItems] = useState(
    Array.from({ length: 20 }, (_, i) => i + 1)
  );
  const [loading, setLoading] = useState(false);

  // 새로운 아이템 20개를 추가하는 함수 (2초간 로딩 시뮬레이션)
  const loadMoreItems = () => {
    setLoading(true);
    setTimeout(() => {
      setItems(prevItems => [
        ...prevItems,
        ...Array.from({ length: 20 }, (_, i) => prevItems.length + i + 1)
      ]);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (loading) return; // 로딩 중이면 추가 호출 방지

      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        loadMoreItems();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div>
      {items.map(item => (
        <div
          key={item}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            margin: '5px 0'
          }}
        >
          Item {item}
        </div>
      ))}
      {loading && <LoadingSpinner />}
    </div>
  );
};

///////////////////////////////////////////////////////////////////////////////////////

const Test = () => {
  console.log('A component render');
  useEffect(() => {
    console.log('A component useEffect');
  });

  return (
    <>
    <div style={{ paddingBottom: '60px' }}>
      <h2>Infinite Scroll List</h2>
      <InfiniteScrollList />
    </div>
    <Footer/>
    </>
  );
};

export default Test;
