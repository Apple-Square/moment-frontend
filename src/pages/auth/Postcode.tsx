import React from 'react';
import DaumPostcode from "react-daum-postcode";
import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";

const Postcode:React.FC = () => {


    const navigate : NavigateFunction = useNavigate();
    const location = useLocation();
    const previousPage = location.state?.previousPage || '/'; // 기본값을 설정
    const nickname = location.state?.nickname || {};
    const userId = location.state?.memberId || {};
    const pwd = location.state?.pwd || {};
    const pwd2 = location.state?.pwd2 || {};
    const birth = 0;
    const gender = location.state?.gender || {};
    const email = location.state?.email || {};

    const themeObj = {
        bgColor: '#FFFFFF',
        pageBgColor: '#FFFFFF',
        postcodeTextColor: '#C05850',
        emphTextColor: '#222222',
    };

    const handleComplete = (data : any) => {
        const { zonecode, buildingName, roadAddress } = data;
        const fullAddress = `${roadAddress} ${buildingName ? `, ${buildingName}` : ''}`;
        navigate(previousPage, {
            state : {
                nickname,
                userId,
                pwd,
                pwd2,
                birth,
                gender,
                email,
                address : fullAddress,
                zonecode
            }
        })
    }

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