import {Route, Routes} from "react-router-dom";
import {AuthMain} from "../../pages/auth/AuthMain.tsx";
import {SignUp} from "../../pages/auth/SignUp.tsx";


export const AppRoutes: React.FC = () => {

    return (<Routes>
        <Route path="/auth">
            <Route path="authMain" element={<AuthMain/>}></Route>
            <Route path="signUp" element={<SignUp/>}></Route>
        </Route>
    </Routes>)
}