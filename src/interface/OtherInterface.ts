import {LoginState, User} from "./DomainInterface.ts";
import {NavigateFunction} from "react-router-dom";

export interface LoginThunkArgs {
    loginState: LoginState;
}

export interface AuthState {
    user: User;
    token : string;
    isAuthenticated: boolean;
    isRedirected : boolean;
    loading: boolean;
    error: unknown;
}