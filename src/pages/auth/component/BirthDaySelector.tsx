import React, { useState } from "react";
import Select, {SingleValue} from "react-select";
import { Col } from "react-bootstrap";
import "../css/bithDaySelector.css";
interface Option {
    value: number;
    label: string;
}
// 연도 생성 함수
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
    const [selectedYear, setSelectedYear] = useState<SingleValue<Option>>(null);
    const [selectedMonth, setSelectedMonth] = useState<SingleValue<Option>>(null);
    const [selectedDay, setSelectedDay] = useState<SingleValue<Option>>(null);

    const handleYearChange = (selectedOption: SingleValue<Option>) => {
        setSelectedYear(selectedOption);
    };

    const handleMonthChange = (selectedOption: SingleValue<Option>) => {
        setSelectedMonth(selectedOption);
    };

    const handleDayChange = (selectedOption: SingleValue<Option>) => {
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
