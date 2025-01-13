import React from 'react';
interface ImgProps extends React.HTMLAttributes<HTMLDivElement> {}

const NaverButtonImg:React.FC<ImgProps> = ({ className, ...rest })  => (
    <img src={`${import.meta.env.BASE_URL}images/naver_login_button.png`}
         alt="Naver Logo"
         className={className} {...rest} />
);
export default NaverButtonImg;