// hooks/useLoginModal.ts
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { setShouldRedirect } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { ThreeValueBoolean } from "../../../interface/OtherInterface.ts";

export const useLoginModal = () => {
    const { isAuthenticated, isAuthTaskFinished, user, loading, shouldRedirect } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const checkAuth = () => {
        if (!loading && (!isAuthenticated || !user?.id) && !shouldRedirect) {
            setShowModal(true);
            return false;
        }
        return true;
    };
    useEffect(() => {
        if (isAuthTaskFinished !== ThreeValueBoolean.True) {
            return;
        }
        checkAuth();
    }, [isAuthenticated, shouldRedirect, user, loading, isAuthTaskFinished]);

    const handleConfirm = () => {
        dispatch(setShouldRedirect(true));
        setShowModal(false);
        navigate("/auth/authMain");
    };

    const handleCancel = () => {
        setShowModal(false);
        if (window.history.length > 1) {
            console.log("이전 페이지 URL:", document.referrer);
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
        loading,
        checkAuth,
    };
};
