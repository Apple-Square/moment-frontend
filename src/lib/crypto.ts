import CryptoJS from 'crypto-js';

const passphrase = import.meta.env.VITE_APP_CRYPTO_SECRET_KEY;
// const passphrase = "g5j4ti8e3n1q9m6i";
// Base64 URL Safe 인코딩



const base64UrlEncode = (str) => {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
// Base64 URL Safe 디코딩
const base64UrlDecode = (str) => {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4 === 0 ? '' : '==='.slice(0, 4 - (str.length % 4));
    return str + pad;
};

export const generateRandomKey = () => {
    return base64UrlEncode(CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64));
};

export const encryptData = (data) => {
    const key = CryptoJS.enc.Utf8.parse(passphrase);
    const iv = CryptoJS.lib.WordArray.random(16); // 16 바이트 길이의 랜덤 iv 생성
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(data)), key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

    // ivData와 encryptedData를 Base64로 인코딩한 후 결합
    const combinedData = iv.toString(CryptoJS.enc.Base64) + ':' + encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    return base64UrlEncode(combinedData); // URI 인코딩
};


export const decryptData = (combinedData) => {
    const decodedData = base64UrlDecode(combinedData); // URI 디코딩
    const [ivData, encryptedData] = decodedData.split(':'); // ivData와 encryptedData 분리

    const key = CryptoJS.enc.Utf8.parse(passphrase);
    const iv = CryptoJS.enc.Base64.parse(ivData);
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedData);

    const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const decryptedString = CryptoJS.enc.Utf8.stringify(decrypted);

    return JSON.parse(decryptedString); // JSON 문자열을 객체로 변환
};


// 세션 스토리지에 데이터를 암호화하여 저장하는 함수
export const setSessionItem = (key, data, expiryInMinutes = 30) => {
    try {
        const now = new Date();
        const item = {
            value : encryptData(data),
            expiry : now.getTime() + expiryInMinutes * 60 * 1000,
        };
        sessionStorage.setItem(key, JSON.stringify(item)); // 암호화된 데이터를 세션 스토리지에 저장
    } catch (error) {
        console.error('데이터 암호화 및 저장 중 오류 발생:', error);
    }
};

// 세션 스토리지에서 데이터를 복호화하여 가져오는 함수
export const getSessionItem = (key) => {
    try {
        const itemStr = sessionStorage.getItem(key);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry) {
            sessionStorage.removeItem(key);
            return null;
        }

        return decryptData(item.value);
    } catch (error) {
        console.error('데이터 복호화 및 가져오기 중 오류 발생:', error);
        return null;
    }
};
export const removeSessionItem = (key) => {
    sessionStorage.removeItem(key);
}

// export const generateNavigateUrl = async (memberId) => {
//     try {
//         const encryptionPromise = new Promise((resolve, reject) => {
//             try {
//                 const { encryptedData, ivData } = encryptWithLv(memberId);
//                 resolve({ encryptedData, ivData });
//             } catch (error) {
//                 reject(error);
//             }
//         });
//
//         const { encryptedData, ivData } = await encryptionPromise;
//
//         const secretId = encodeURIComponent(encryptedData);
//         const secretIv = encodeURIComponent(ivData);
//         const mainPageUri = import.meta.env.REACT_APP_MAIN_PAGE_URI || '/member/getMemberProfile';
//
//         console.log("네비게이트하기전 확인 :: uri인코딩,암호화된멤버아이디",
//             secretId, "uri인코딩,암호화된Iv",
//             secretIv, "메인페이지URI",
//             mainPageUri);
//
//         const navigateUri = `${mainPageUri}/${secretId}/${secretIv}`;
//         return navigateUri;
//     } catch (error) {
//         console.error("암호화 처리 중 오류 발생:", error);
//         return null;
//     }
// };