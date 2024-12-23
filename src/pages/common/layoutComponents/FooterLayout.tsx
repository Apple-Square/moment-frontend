import React, {useEffect} from "react";
import {Container} from "react-bootstrap";
import {Footer} from "../components/Footer.tsx";
import styles from "../css/layout.module.css"

interface FooterLayoutProps {
    children: React.ReactNode;
}
export const FooterLayout: React.FC<FooterLayoutProps> = ({ children }) => {

    useEffect(() => {
        // FooterLayout이 마운트되었을 때 body에 패딩 추가
        // 패딩 10vh, 푸터 height 10vh로 맞추면 푸터 상단에 빈틈 생기는 문제 해결
        document.body.style.paddingBottom = '8.6vh';

        // FooterLayout이 언마운트될 때 패딩 제거
        return () => {
            document.body.style.paddingBottom = '';
        };
    }, []);

    //footerLayout 스타일을 각각의 코드에 다 옮기기.
    return (
        <Container className={styles.footerLayout}>
            {children}
            <Footer />
        </Container>
    );
};