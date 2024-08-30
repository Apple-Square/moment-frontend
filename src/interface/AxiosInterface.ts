export interface LoginRequestDto {
    username : string,
    password : string
}
export interface LoginResponseDto {
    data : {
        timestamp : string,
        message : string,
        user : {
            id : string,
            nickname : string,
            profileImage : string
        },
    },
    token : string
}
//아직 안정해짐
export interface LogoutRequestDto {
    refreshToken : string
}