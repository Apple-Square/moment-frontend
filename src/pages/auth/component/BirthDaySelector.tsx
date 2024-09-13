import React, { useState } from "react";
import Select, {SingleValue} from "react-select";
import { Col } from "react-bootstrap";
import "../css/bithDaySelector.css";

// 연도 생성 함수
interface OptionType {
    value: number;
    label: string;
}
const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => ({
        value: currentYear - i,
        label: `${currentYear - i}`,
    }));
};

// 월 생성 함수
const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}`.padStart(2, "0"),
    }));
};

// 일 생성 함수
const generateDays = () => {
    return Array.from({ length: 31 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}`.padStart(2, "0"),
    }));
};


const BirthdaySelector: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState<SingleValue<OptionType>>(null);
    const [selectedMonth, setSelectedMonth] = useState<SingleValue<OptionType>>(null);
    const [selectedDay, setSelectedDay] = useState<SingleValue<OptionType>>(null);

    const handleYearChange = (selectedOption: SingleValue<OptionType>) => {
        setSelectedYear(selectedOption);
    };

    const handleMonthChange = (selectedOption: SingleValue<OptionType>) => {
        setSelectedMonth(selectedOption);
    };

    const handleDayChange = (selectedOption: SingleValue<OptionType>) => {
        setSelectedDay(selectedOption);
    };

    return (
        <>
            <Col className="mb-3">
                <Select
                    options={generateYears()}
                    placeholder="생년"
                    value={selectedYear}
                    onChange={handleYearChange}
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            borderRadius: "5px",
                            width:"100%",
                            height:"100%"
                        }),
                        placeholder: (provided) => ({
                            ...provided,
                            fontSize: "1.5vh", // 글씨 크기 줄이기
                        })
                    }}
                    menuPortalTarget={null} // 포털을 사용하지 않도록 설정
                    menuPosition="absolute" // absolute 위치 사용
                />
            </Col>
            <Col className="mb-3">
                <Select
                    options={generateMonths()}
                    placeholder="월"
                    value={selectedMonth}
                    onChange={handleMonthChange}
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
            <Col className="mb-3">
                <Select
                    options={generateDays()}
                    placeholder="일"
                    value={selectedDay}
                    onChange={handleDayChange}
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
        </>
    );
};

export default BirthdaySelector;
