import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/store/hooks.ts";
import {setShouldRedirect} from "./redux/slices/authSlice.ts";
import {LoginRecommandModal} from "./pages/common/components/LoginRecommandModal.tsx";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, user, loading, shouldRedirect } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!loading && (!isAuthenticated || !user?.id) && !shouldRedirect) {
            setShowModal(true);
        }
    }, [isAuthenticated, shouldRedirect, user, loading]);

    const handleConfirm = () => {
        dispatch(setShouldRedirect(true));
        setShowModal(false);
        navigate("/auth/authMain");
    }

    const handleCancel = () => {
        setShowModal(false);
        if (window.history.length > 1) {
            console.log("이전 페이지 URL:", document.referrer);
            navigate(-1);
        } else {
            navigate("/auth/authMain");
        }
    };

    if (loading) {
        return null;
    }

    return (
        <>
            {showModal && (
                <LoginRecommandModal
                    open={showModal}
                    onClose={handleCancel}
                    onConfirm={handleConfirm}
                />
            )}
            {children}
        </>
    );
};

export default PrivateRoute;
