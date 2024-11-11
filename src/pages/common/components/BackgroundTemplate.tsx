import React, {ReactNode, useEffect} from 'react';
import {AuthMain} from "../../auth/AuthMain"
import {useLocation} from "react-router-dom";
import {showToast} from "../../../lib/ToastNotification.ts";
interface BackgroundTemplateProps {
    children: ReactNode;
}

const BackgroundTemplate: React.FC<BackgroundTemplateProps> = ({ children }) => {

    useEffect(() => {
        const htmlElement = document.documentElement;
        const backgroundStyle = 'linear-gradient(to right, #EBFBFF 0%, #EBFBFF 0%, #F6F6F6 30%, #F6F6F6 100%)'
        htmlElement.style.background = backgroundStyle;
        const bodyElement = document.body;
        bodyElement.style.background = "#F6F6F6";
        return () => {
            htmlElement.style.background = '#FFFFFF';
            bodyElement.style.background = '#FFFFFF';
        }

    }, []);

    return (
        <div>
            {children}
        </div>
    )
};

export default BackgroundTemplate;
