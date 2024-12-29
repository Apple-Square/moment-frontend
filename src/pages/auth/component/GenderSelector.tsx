import React, {useCallback, useEffect, useState} from "react";
import Select, {SingleValue} from "react-select";
import {Col} from "react-bootstrap";
import "../css/genderSelector.css";
import {getSessionItem, setSessionItem} from "../../../lib/crypto.ts";
import {SESSON_STORAGE_KEY, SESSON_STORAGE_REFRESH_TIME} from "../key/key.ts";
import lodash from "lodash";
interface OptionType {
    value: string;
    label: string;
}

const genderOptions: OptionType[] = [
    { value: "MALE", label: "남" },
    { value: "FEMALE", label: "여" },
];

const GenderSelector: React.FC = () => {
    const [gender, setGender] = useState<OptionType | null>(null);

    const savedInfo = getSessionItem(SESSON_STORAGE_KEY);

    useEffect(() => {
        if (savedInfo) {
            if (savedInfo.gender) setGender(savedInfo.gender);
        }
    }, []);

    const debouncedSaveToSession = useCallback(
        lodash.debounce(() => {
            const userInfo = {
                ...savedInfo,
                gender
            };
            setSessionItem(SESSON_STORAGE_KEY, userInfo);
            console.log("세션 스토리지에 저장되었습니다!");
        }, SESSON_STORAGE_REFRESH_TIME),
        [gender]
    );

    useEffect(() => {
        debouncedSaveToSession();
        return () => {
            debouncedSaveToSession.cancel();
        };
    }, [gender]);

    const handleGenderChange = (selectedOption : SingleValue<OptionType>) => {
        setGender(selectedOption);
    }


    return (
        <Col className="mb-3">
            <Select
                options={genderOptions}
                placeholder="성별" // 성별 플레이스홀더
                value={gender}
                onChange={handleGenderChange}
                styles={{
                    control: (provided) => ({
                        ...provided,
                        borderRadius: "5px",
                        width:"100%",
                        height:"100%"
                    })
                }}
            />
        </Col>
    );
};

export default GenderSelector;
