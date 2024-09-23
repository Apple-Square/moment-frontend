import React, { useState } from "react";
import styles from "../css/TagInput.module.css";
import SvgDel from "./SvgDel";

interface tagInputProps {
    setTagOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: React.FC<tagInputProps> = ({ setTagOpen, setTags }) => {
    const [text, setText] = useState('');
    const [taglist, setTagList] = useState<string[]>([]);

    const handleAddClick = () => {
        if (text) {
            const newTags = text.split(/\s+/);
            setTagList([...taglist, ...newTags])
            setText('');
        }
    }

    const handleDeleteTag = (indexToDelete: number) => {
        const updatedTags = taglist.filter((_, index) => index !== indexToDelete);
        setTagList(updatedTags);
    }

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.tagBox}`}>
                {taglist && taglist.map((tag, index) => (
                    <>
                        <div key={index} className={`${styles.tag}`}>
                            {tag}<SvgDel className={`${styles.close}`} onClick={() => handleDeleteTag(index)} />
                        </div>
                        <span style={{ padding: '1%' }} /> {/* gutters inter tag */}
                    </>
                ))}
            </div >
            <div className={`${styles.inputBox}`}>
                <input
                    type="text"
                    placeholder="태그를 입력하세요(띄어쓰기로 구분)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button className={`${styles.addBtn}`} onClick={() => { handleAddClick() }}>
                    입력
                </button>
                <button className={`${styles.submitBtn}`} onClick={() => { setTagOpen(false); setTags(taglist); }}>
                    완료
                </button>
            </div>
        </div>
    );
};

export default TagInput;