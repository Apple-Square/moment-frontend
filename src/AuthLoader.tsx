import {useAppDispatch, useAppSelector} from "./redux/store/hooks.ts";
import {useEffect} from "react";
import {axiosInstance} from "./lib/axiosInstance.ts";
import {refreshRequest} from "./pages/auth/function/authAxios.ts";
import {getMeRequest} from "./pages/user/function/userAxios.tsx";

const AuthLoader = ({children}) => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    useEffect(()=>{

        //인증이 되어 있을 때는 수행할 게 없다.
        //refresh에 보내야함
        let response;
        if(!auth.isAuthenticated && !auth.token && !auth.loading){

            const fetchData = async() => {
                response = await refreshRequest();
                console.log(JSON.stringify(response, null, 2));
            }
            fetchData();
        }

        if(response && response?.status === 200 && response?.headers?.authorization){
            const fetchMe = async() => {
                response = await getMeRequest();
                console.log(JSON.stringify(response, null, 2));
            }
            fetchMe();
        }


    })
}