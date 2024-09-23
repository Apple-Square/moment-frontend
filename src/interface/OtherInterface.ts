import {LoginState, User} from "./DomainInterface.ts";
import {NavigateFunction} from "react-router-dom";

export interface LoginThunkArgs extends Pick<User, 'username' | 'password'> {}

export interface AuthState {
    user: User;
    //token : string;
    isAuthenticated: boolean;
    shouldRedirect : boolean;
    loading: boolean;
    error: unknown;
}