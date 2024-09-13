import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from 'react-use-gesture';
import { CSSProperties } from "react";
import styled from "styled-components";

export const LoginRecommandModal = ({ open, onClose, onConfirm }) => {
    const [isOpen, setIsOpen] = useState(open);
    const [height, setHeight] = useState(200); // 초기 모달 높이

    // 모달이 슬라이드로 나타나고 사라지는 애니메이션 설정
    const springProps = useSpring({
        transform: isOpen ? `translateY(0)` : `translateY(100%)`,
        config: { tension: 220, friction: 20 },
    });

    // 드래그 가능 ? 불가능 ?  {{...bind()}}를 animate.div에 넣으면 됨.
    // const bind = useDrag(({ event, movement: [, my], memo = height }) => {
    //     event.preventDefault();  // 스크롤 이벤트 방지
    //     const newHeight = Math.max(200, memo - my);
    //     setHeight(newHeight);
    //     return memo;
    // }, {
    //     pointer: true,
    //     threshold: 5,
    // });
    return (
        <div style={{
            display:"flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            {isOpen && (
                <div style={overlayStyle as CSSProperties}></div>
            )}
            <animated.div
                style={{
                    ...springProps,
                    ...modalStyle,
                    height: `${height}px`,  // height를 명시적으로 string으로 처리
                    touchAction: 'none',  // 스크롤 방지
                }}
            >
                <div style={handleStyle}></div>
                <h2 style={{paddingBottom: "0.3vw"}}>로그인이 필요합니다</h2>
                <p>로그인 하시겠습니까?</p>
                <Button onClick={onClose}>이전 페이지로..</Button>
                <Button onClick={onConfirm}>로그인 하기</Button>
            </animated.div>
        </div>
    );
};

const Button = styled.button`
    width: 110px;
    font-size: 13px;
    margin: 10px;
    padding: 0.5vw 0.5vw;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #f0f0f0;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.1s ease, box-shadow 0.1s ease;

    &:active {
        transform: scale(0.95);
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
    }
`;


const overlayStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
};

const modalStyle: CSSProperties = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: "15px",
    borderTopRightRadius: "15px",
    zIndex: 1001,
    boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
    textAlign: "center", // 중앙 정렬 추가
};

const handleStyle: CSSProperties = {
    width: "40px",
    height: "5px",
    backgroundColor: "#ccc",
    borderRadius: "10px",
    margin: "10px auto",
};