import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../redux/store/store.ts";

// 이 방식은 함수를 새로 정의함.함.
// useDispatch를 호출하고 그 결과를 AppDispatch 타입으로 명시적으로 타입 단언함.
// export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppDispatch: () => AppDispatch = useDispatch;