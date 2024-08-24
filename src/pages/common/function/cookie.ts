import Cookies from 'js-cookie';

export const clearAllCookies = () => {
    const cookies = Cookies.get();
    for (const cookie in cookies) {
        Cookies.remove(cookie);
    }
    console.log("모든 쿠키 삭제 시도 완료");
};