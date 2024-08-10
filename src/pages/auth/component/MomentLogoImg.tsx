import React from "react";
interface ImgProps extends React.HTMLAttributes<HTMLDivElement> {}

const MomentLogoImg: React.FC<ImgProps> = ({ className, ...rest })  => (
        <img src={`${import.meta.env.BASE_URL}images/moment_logo.png`}
             alt="Moment Logo"
             style={{maxWidth: "100%", height:"auto"}} className={className} {...rest}
        />
    );

export default MomentLogoImg;
