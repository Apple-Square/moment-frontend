import './App.css'
import {AppRoutes} from "./AppRoutes.tsx";
import {AuthLoader} from "./AuthLoader.tsx";
import {useDispatch, useSelector} from "react-redux";
import {useAppDispatch, useAppSelector} from "./redux/store/hooks.ts";



function App() {
  return (
    <>
        <AuthLoader>
            <AppRoutes />
        </AuthLoader>
    </>
  )
}

export default App
