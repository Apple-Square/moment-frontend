const PHONE_NUMBER_PATTERN = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// - 8~20자
// - 알파벳 대소문자, 숫자, 밑줄 (_), 하이픈 (-) 사용 가능
// - 공백 입력 불가
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{8,20}$/;
const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9_-]{2,20}$/;
// - 10~20자
// - 알파벳 대문자, 소문자, 숫자, 특수 문자 ( ! ? @ # $ % ^ & ) 1개 이상 포함
// - 공백 입력 불가
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!?@#$%^&])[A-Za-z\d!?@#$%^&]{10,20}$/;

export const userValidator = {
    validatePhoneNumber: (phoneNumber: string) => {
        if(phoneNumber.length === 0) {
            return "";
        }
        if (!PHONE_NUMBER_PATTERN.test(phoneNumber)) {
            return "휴대폰 번호를 확인해주세요.";
        }
        return "";
    },
    validateNickname: (nickname: string) => {
        if (nickname.length === 0) {
            return "닉네임을 입력해주세요.";
        }
        if (!NICKNAME_PATTERN.test(nickname)) {
            return "닉네임은 2~20자, 한글, 알파벳, 숫자, 밑줄(_), 하이픈(-)만 허용";
        }
        return "";
    },
    validateEmail: (email: string) => {
        if(email.length === 0) {
            return "";
        }
        if (!EMAIL_PATTERN.test(email)) {
            return "이메일을 확인해주세요.";
        }
        return "";
    },
    validateUsername: (username: string) => {
        if (username.length === 0) {
            return "";
        }
        if (!USERNAME_PATTERN.test(username)) {
            return "올바르지 않은 형식(8자~20자)";
        }
        return "";
    },
    validatePassword: (password: string) => {
        if(password.length === 0) {
            return "";
        }
        if (!PASSWORD_PATTERN.test(password)) {
            return "10~20자, 대소문자, 숫자, 특수문자 1개 이상";
        }
        return "";
    },
    validatePasswordConfirm: (password: string, passwordConfirm: string) => {
        if (password !== passwordConfirm) {
            return "비밀번호가 일치하지 않습니다.";
        }
        return "";
    },
};