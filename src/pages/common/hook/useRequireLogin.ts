// hooks/useRequireLogin.ts
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { setShouldRedirect } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { ThreeValueBoolean } from "../../../interface/OtherInterface.ts";


/**
 * 좋아요를 누르는 버튼이 있다.
 * 좋아요 버튼을 눌렀을 때 로그인 되어있으면 단순 실행.
 * 로그인 안되어있으면 모달을 보여준다.
 *
 * const safeHandleLike = () => {
 *     requiredLogin(handleLike);
 * }
 * const handleLike = () => {
 *     기존의 처리 로직..
 * }
 * onClick(safeHandleLike)
 */
export const useRequireLogin = () => {
    const { isAuthenticated, isFirstAuthTaskFinished, user, loading, shouldRedirect } = useAppSelector((state) => state.auth);
    const { showModal,setShowModal, handleConfirm, handleCancel } = useLoginModal();

    const requireLogin = (action: () => void) => {

        if (isFirstAuthTaskFinished !== ThreeValueBoolean.True) {
            return;
        }

        if (!loading && (!isAuthenticated || !user?.id) && !shouldRedirect) {
            setShowModal(true);
        } else {
            action(); // 로그인이 되어 있다면 동작 실행
        }
    };

    return {
        requireLogin,
        showModal,
        handleConfirm,
        handleCancel };
};
/**
 * 이 hook을 사용하기만 하면 그 페이지에서  로그인 여부에 따라 로그인 모달을 보여준다.
 */
export const useCheckLogin = () => {
    const { isAuthenticated, isFirstAuthTaskFinished, user, shouldRedirect } = useAppSelector((state) => state.auth);
    const { showModal,setShowModal, handleConfirm, handleCancel } = useLoginModal();
    const [loading, setLoading] = useState(true);
    const checkAuth = () => {
        if (loading && (!isAuthenticated || !user?.id) && !shouldRedirect) {
            setShowModal(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFirstAuthTaskFinished !== ThreeValueBoolean.True) {
            return;
        }
        checkAuth();
    }, [showModal,
        handleConfirm,
        handleCancel,
        loading]);

    return {
        showModal,
        handleConfirm,
        handleCancel,
        loading
    };
}

export const useLoginModal = () => {
     const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleConfirm = () => {
        dispatch(setShouldRedirect(true));
        setShowModal(false);
        navigate("/auth/authMain");
    };

    const handleCancel = () => {
        setShowModal(false);
        if (window.history.length > 1) {
            // console.log("이전 페이지 URL:", document.referrer);
            navigate(-1);
        } else {
            navigate("/auth/authMain");
        }
    };

    return {
        showModal,
        setShowModal,
        handleConfirm,
        handleCancel,
    };
};
