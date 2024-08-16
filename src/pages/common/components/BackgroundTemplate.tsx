import React, { ReactNode } from 'react';

interface BackgroundTemplateProps {
    children: ReactNode;
}

const BackgroundTemplate: React.FC<BackgroundTemplateProps> = ({ children }) => (
    <div
        style={{
            background: 'linear-gradient(to right, #EBFBFF 0%, #EBFBFF 0%, #F6F6F6 30%, #F6F6F6 100%)',
            minWidth: "375px",
            minHeight: "667px",
            width:"100vw",
            height:"100vh"
        }}
    >
        {children}
    </div>
);

export default BackgroundTemplate;
