import React, { useState } from "react";
import Select, {SingleValue} from "react-select";
import {Col} from "react-bootstrap";
import "../css/genderSelector.css";

interface OptionType {
    value: string;
    label: string;
}

interface GenderSelectorProps {
    setGenderCallback : (gender : string) => void;
}

const genderOptions: OptionType[] = [
    { value: "MALE", label: "남" },
    { value: "FEMALE", label: "여" },
];

const GenderSelector: React.FC<GenderSelectorProps> = ({setGenderCallback}) => {
    const [selectedGender, setSelectedGender] = useState<OptionType | null>(null);

    const updateParent = (selectedGender : SingleValue<OptionType>) => {
        if (selectedGender){
            setGenderCallback(selectedGender.value);
        }
    }

    const handleGenderChange = (selectedOption : SingleValue<OptionType>) => {
        setSelectedGender(selectedOption);
        updateParent(selectedOption)
    }


    return (
        <Col className="mb-3">
            <Select
                options={genderOptions}
                placeholder="성별" // 성별 플레이스홀더
                value={selectedGender}
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
