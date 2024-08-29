import {LoginState, User} from "./DomainInterface.ts";
import {NavigateFunction} from "react-router-dom";

export interface LoginThunkArgs {
    loginState: LoginState | null;
}

export interface AuthState {
    user: User | null;
    token : string;
    isAuthenticated: boolean;
    isRedirected : boolean;
    loading: boolean;
    error: unknown;
}