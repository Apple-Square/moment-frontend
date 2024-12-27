import React, { useState } from "react";
import Select, {SingleValue} from "react-select";
import { Col } from "react-bootstrap";
import "../css/bithDaySelector.css";

// 연도 생성 함수
interface OptionType {
    value: number;
    label: string;
}

interface BirthDaySelectorProps {
    setBirthCallback : (year : number, month : number, day : number) => void;
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


const BirthdaySelector: React.FC<BirthDaySelectorProps> = ({setBirthCallback}) => {
    const [selectedYear, setSelectedYear] = useState<SingleValue<OptionType>>(null);
    const [selectedMonth, setSelectedMonth] = useState<SingleValue<OptionType>>(null);
    const [selectedDay, setSelectedDay] = useState<SingleValue<OptionType>>(null);

    const updateParent = (
        selectedYear : SingleValue<OptionType>,
        selectedMonth : SingleValue<OptionType>,
        selectedDay : SingleValue<OptionType>
    ) => {
        if (selectedYear && selectedMonth && selectedDay) {
            setBirthCallback(selectedYear.value, selectedMonth.value, selectedDay.value);
        } else {
            setBirthCallback(0, 0, 0);
        }
    }

    const handleYearChange = (selectedOption: SingleValue<OptionType>) => {
        setSelectedYear(selectedOption);
        updateParent(selectedOption, selectedMonth, selectedDay);
    };

    const handleMonthChange = (selectedOption: SingleValue<OptionType>) => {
        setSelectedMonth(selectedOption);
        updateParent(selectedYear, selectedOption, selectedDay);
    };

    const handleDayChange = (selectedOption: SingleValue<OptionType>) => {
        setSelectedDay(selectedOption);
        updateParent(selectedYear, selectedMonth, selectedOption);
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
                            height:"100%",
                            fontSize: "1.4vh",
                        }),
                        placeholder: (provided) => ({
                            ...provided,
                            fontSize: "1vh",
                        })
                    }}
                    menuPortalTarget={null}
                    menuPosition="fixed"
                    menuShouldScrollIntoView={false}
                />
            </Col>
            <Col className="mb-3 p-0">
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
                            height:"100%",
                            fontSize: "2vh",
                        }),
                        placeholder: (provided) => ({
                            ...provided,
                            fontSize: "2vh",
                        })
                    }}
                    menuPortalTarget={null}
                    menuPosition="fixed"
                    menuShouldScrollIntoView={false}
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
                            height:"100%",
                            fontSize: "2vh",
                        }),
                        placeholder: (provided) => ({
                            ...provided,
                            fontSize: "2vh",
                        })
                    }}
                    menuPortalTarget={null}
                    menuPosition="fixed"
                    menuShouldScrollIntoView={false}
                />
            </Col>
        </>
    );
};

export default BirthdaySelector;
