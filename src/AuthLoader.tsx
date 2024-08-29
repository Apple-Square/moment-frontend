import {useAppDispatch, useAppSelector} from "./redux/store/hooks.ts";
import {useEffect} from "react";

const AuthLoader = ({children}) => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    useEffect(()=>{

        //인증이 되어 있을 때는 수행할 게 없다.
        if(!auth.isAuthenticated && auth.token){

        }

    })
}