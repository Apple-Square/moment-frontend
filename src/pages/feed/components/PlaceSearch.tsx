import React, { useState } from "react";
import styles from "../css/PlaceSearch.module.css";

interface SearchPlaceProps {
    setPlaceTag: React.Dispatch<React.SetStateAction<Boolean>>;
}

const SearchPlace: React.FC<SearchPlaceProps> = ({ setPlaceTag }) => {  // 계단식 액션 -> 상위에서 적용
    const [place, setPlace] = useState('');

    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="장소 검색"
                    value={place}
                    onChange={(e) => { setPlace(e.target.value) }}
                />
                <button
                    onClick={() => {}}
                >
                    검색
                </button>
            </div>
            <div className={styles.placeList}>
                <ul>
                    <li>유토피아</li>
                    <li>버그없는세상</li>
                    <li>놀고먹는데돈이계속늘어나는세상</li>
                </ul>
            </div>
            <div className={styles.buttonBox}>
            <button
                    onClick={() => {
                        setPlace('');
                        setPlaceTag(false);
                    }}
                >
                    취소
                </button>
                <button
                    onClick={() => {
                        setPlaceTag(false);
                    }}
                >
                    선택
                </button>
            </div>
        </div>
    );
}

export default SearchPlace;