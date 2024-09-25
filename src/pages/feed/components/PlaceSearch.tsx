import React, { useState } from "react";
import styles from "../css/PlaceSearch.module.css";

interface SearchPlaceProps {
    setPlaceOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setPlace: React.Dispatch<React.SetStateAction<string>>;
}

const SearchPlace: React.FC<SearchPlaceProps> = ({ setPlaceOpen, setPlace }) => {  // 계단식 액션 -> 상위에서 적용
    const [text, setText] = useState('');
    const [selected, setSelected] = useState('');

    const handlePlaceClick = (event: React.MouseEvent<HTMLLIElement>) => {
        const placeName = event.currentTarget.textContent;
        (placeName) ? setSelected(placeName) : setSelected(selected);
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="장소 검색"
                    value={text}
                    onChange={(e) => { setText(e.target.value) }}
                />
                <button
                    onClick={() => { }}
                >
                    검색
                </button>
            </div>
            <div className={styles.placeList}>
                <ul>
                    {/* getPoint */}
                    <li onClick={handlePlaceClick}>유토피아</li>
                    <li onClick={handlePlaceClick}>버그없는세상</li>
                    <li onClick={handlePlaceClick}>놀고먹는데돈이계속늘어나는세상</li>
                </ul>
            </div>
            <div className={styles.buttonBox}>
                <button
                    onClick={() => {
                        setSelected('');       // 취소(적용 삭제)
                        setPlaceOpen(false);
                    }}
                >
                    취소
                </button>
                <button
                    onClick={() => {
                        // console.log(text);
                        if (selected) {
                            setPlace(selected);
                            console.log(selected);
                            setPlaceOpen(false);
                        } else {
                            alert("장소를 선택해주세요");
                        }
                    }}
                >
                    선택
                </button>
            </div>
        </div>
    );
}

export default SearchPlace;