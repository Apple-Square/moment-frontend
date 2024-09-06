import './App.css'
import {AppRoutes} from "./AppRoutes.tsx";
import {AuthLoader} from "./AuthLoader.tsx";



function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
        <AuthLoader>
        <AppRoutes />
        </AuthLoader>
    </>
  )
}

export default App
