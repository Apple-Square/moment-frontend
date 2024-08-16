import React, { useState } from "react";
import Select from "react-select";
import {Col} from "react-bootstrap";
import "../css/genderSelector.css";
// 간단한 타입 정의
interface OptionType {
    value: string;
    label: string;
}

// 성별 옵션 생성
const genderOptions: OptionType[] = [
    { value: "male", label: "남" },
    { value: "female", label: "여" },
];

const GenderSelector: React.FC = () => {
    const [selectedGender, setSelectedGender] = useState<OptionType | null>(null);

    return (
        <Col className="mb-3">
            <Select
                options={genderOptions}
                placeholder="성별" // 성별 플레이스홀더
                value={selectedGender}
                onChange={(option) => setSelectedGender(option as OptionType)}
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
