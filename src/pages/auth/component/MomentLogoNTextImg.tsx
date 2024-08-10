import React from "react";
interface ImgProps extends React.HTMLAttributes<HTMLDivElement> {}

const MomentLogoNTextImg: React.FC<ImgProps> = ({ className, ...rest })  => (
    <img src={`${import.meta.env.BASE_URL}images/moment_logo_text.png`}
         alt="Moment LogoNText"
         style={{maxWidth: "100%", height:"auto"}} className={className} {...rest}
    />
);

export default MomentLogoNTextImg;
