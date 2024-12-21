import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {store} from "./redux/store/store.ts"
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

if (import.meta.env.DEV) {
    import('./mocks/browser').then(({ worker }) => {
        worker.start();
    });
}

console.log("메인 렌더링");

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
)
