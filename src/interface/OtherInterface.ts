import {LoginState, User} from "./DomainInterface.ts";
import {NavigateFunction} from "react-router-dom";

export interface LoginThunkArgs extends Pick<User, 'username' | 'password'> {}

export enum ThreeValueBoolean {
    False = 'false',
    Loading = 'loading',
    True = 'true',
}

export interface AuthState {
    user: User;
    //token : string;
    isAuthenticated: boolean;
    shouldRedirect : boolean;
    isFirstAuthTaskFinished : ThreeValueBoolean;
    loading: boolean;
    error: unknown;
}