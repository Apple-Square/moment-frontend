export interface User {
    id : string
    nickname : string,
    username : string,
    password : string,
    birth : string,
    gender : string,
    email : string,
    address : string,
    profileImage : string,
    profileIntro: string,
}

export interface LoginState extends Pick<User, 'username' | 'password'> {
    usernameError : string,
    passwordError : string,
}

