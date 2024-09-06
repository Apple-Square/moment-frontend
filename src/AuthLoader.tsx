import {useAppDispatch, useAppSelector} from "./redux/store/hooks.ts";
import {useEffect} from "react";
import {refreshRequest} from "./pages/auth/function/authAxios.ts";
import {getMeRequest} from "./pages/user/function/userAxios.tsx";
import {setUserAndToken} from "./redux/slices/authSlice.ts";
import {merge} from "chart.js/helpers";

export const AuthLoader = ({children}) => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            if (!auth.isAuthenticated && !auth.token && !auth.loading) {
                const response = await refreshRequest();
                console.log(JSON.stringify(response, null, 2));

                if (response?.status === 200 && response?.headers?.authorization) {
                    const userResponse = await getMeRequest();
                    console.log(JSON.stringify(userResponse, null, 2));

                    if(userResponse === undefined){
                        return;
                    }

                    dispatch(setUserAndToken({
                        user: userResponse.data.user,
                        token: response.headers.authorization,
                    }));
                }
            }
        };

        fetchData();
    }, [dispatch, auth]);
    //서버로 부터

    useEffect(() => {

        console.log("AuthLoader :: "+JSON.stringify(auth, null, 2));
    },[auth]);

    return <>{children}</>
};