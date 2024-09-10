import React from "react";
import {Container} from "react-bootstrap";
import {Footer} from "../components/Footer.tsx";


interface FooterLayoutProps {
    children: React.ReactNode;
}
export const FooterLayout: React.FC<FooterLayoutProps> = ({ children }) => {
    return (
        <Container style={styles.container}>
            {children}
            <Footer />
        </Container>
    );
};
const styles: {[key : string] : React.CSSProperties} = {
    container: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'stretch',
        flexDirection: 'column',
        maxWidth: "768px",
        minHeight: '100vh',
        width: '100vw',
        height: '100%',
        padding: '0 0px', /* 내부 패딩 설정 */
        overflowY: 'visible',
        overflowX: 'visible',
        boxSizing: "border-box",
        position:"relative",
    },
}