import React from 'react';
import DaumPostcode from "react-daum-postcode";
import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";
import {getSessionItem, setSessionItem} from "../../lib/crypto.ts";

const Postcode:React.FC = () => {

    const navigate : NavigateFunction = useNavigate();
    const location = useLocation();

    const sessionStorageKey = "signUpInfo";

    const themeObj = {
        bgColor: '#FFFFFF',
        pageBgColor: '#FFFFFF',
        postcodeTextColor: '#C05850',
        emphTextColor: '#222222',
    };

    const handleComplete = (data: any) => {
        const { zonecode, buildingName, roadAddress } = data;
        const fullAddress = `${roadAddress} ${buildingName ? `, ${buildingName}` : ''}`;
        const savedInfo = getSessionItem(sessionStorageKey);
        if (savedInfo) setSessionItem(sessionStorageKey, { ...savedInfo, address: fullAddress }, 5);
        navigate('/auth/signUp');
    };

    return (
        <div>
            <DaumPostcode
                theme={themeObj}
                onComplete={handleComplete}
            />
        </div>
    );
};

export default Postcode;