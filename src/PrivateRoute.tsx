// PrivateRoute.tsx
import React from "react";
import { useLoginModal } from './pages/common/hook/useLoginModal.ts'
import { LoginRecommandModal } from "./pages/common/components/LoginRecommandModal.tsx";

const PrivateRoute = ({ children }) => {
    const {
        showModal,
        handleConfirm,
        handleCancel,
        loading,
    } = useLoginModal();

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
