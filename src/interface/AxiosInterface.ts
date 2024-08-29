export interface LoginRequestDto {
    username : string,
    password : string
}
//아직 안정해짐
export interface LogoutRequestDto {
    refreshToken : string
}