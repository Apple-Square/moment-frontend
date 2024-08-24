export interface User {
    nickname : string,
    username : string,
    password : string,
    birth : string,
    gender : string,
    email : string,
    address : string,
    profilePhotoUrl : string,
    profileIntro: string,
}

export interface LoginState extends Pick<User, 'username' | 'password'> {
    // LoginData는 User의 username과 password만 포함
}