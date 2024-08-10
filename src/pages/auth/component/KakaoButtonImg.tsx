interface ImgProps extends React.HTMLAttributes<HTMLDivElement> {}


const KakaoButtonImg:React.FC<ImgProps> = ({ className, ...rest })  => (
    <img src={`${import.meta.env.BASE_URL}images/kakao_login_large_wide.png`}
         alt="Kakao Logo"
         className={className} {...rest} />
);
export default KakaoButtonImg;