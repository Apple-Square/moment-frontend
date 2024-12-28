import React, {useCallback, useEffect, useState} from "react";
import Select, {SingleValue} from "react-select";
import { Col } from "react-bootstrap";
import "../css/bithDaySelector.css";
import lodash from "lodash";
import {getSessionItem, setSessionItem} from "../../../lib/crypto.ts";
import {SESSON_STORAGE_KEY, SESSON_STORAGE_REFRESH_TIME} from "../key/key.ts";

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
    const [year, setYear] = useState<SingleValue<OptionType>>(null);
    const [month, setMonth] = useState<SingleValue<OptionType>>(null);
    const [day, setDay] = useState<SingleValue<OptionType>>(null);

    const savedInfo = getSessionItem(SESSON_STORAGE_KEY);

    useEffect(() => {
        console.log("이거보면 끝 : "+JSON.stringify(savedInfo));
        if (savedInfo) {
            if (savedInfo.year) setYear(savedInfo.year);
            if (savedInfo.month) setMonth(savedInfo.month);
            if (savedInfo.day) setDay(savedInfo.day);
        }
    }, []);

    const debouncedSaveToSession = useCallback(
        lodash.debounce(() => {
            const userInfo = {
                ...savedInfo,
                year : year,
                month : month,
                day : day
            };
            setSessionItem(SESSON_STORAGE_KEY, userInfo);
            console.log("세션 스토리지에 저장되었습니다! :: " + JSON.stringify(userInfo, null, 2));
            console.log(getSessionItem(SESSON_STORAGE_KEY));
        }, SESSON_STORAGE_REFRESH_TIME),
        [year,month,day]
    );

    useEffect(() => {
        debouncedSaveToSession();
        return () => {
            debouncedSaveToSession.cancel();
        };
    }, [year, month, day]);

    const handleYearChange = (selectedOption: SingleValue<OptionType>) => {
        setYear(selectedOption);
    };

    const handleMonthChange = (selectedOption: SingleValue<OptionType>) => {
        setMonth(selectedOption);
    };

    const handleDayChange = (selectedOption: SingleValue<OptionType>) => {
        setDay(selectedOption);
    };

    return (
        <>
            <Col className="mb-3">
                <Select
                    options={generateYears()}
                    placeholder="생년"
                    value={year}
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
                    value={month}
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
                    value={day}
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
