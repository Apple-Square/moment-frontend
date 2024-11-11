import React, { useState } from "react";
import styles from "../css/TagInput.module.css";
import SvgDel from "./SvgDel";

interface tagInputProps {
    tags: string[];
    setTagOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: React.FC<tagInputProps> = ({ tags, setTagOpen, setTags }) => {
    const [text, setText] = useState('');
    // const [taglist, setTagList] = useState<string[]>([]);

    const handleAddClick = () => {
        if (text) {
            const newTags = text.split(/\s+/);
            setTags([...tags, ...newTags])
            setText('');
        }
    }

    const handleDeleteTag = (indexToDelete: number) => {
        const updatedTags = tags.filter((_, index) => index !== indexToDelete);
        setTags(updatedTags);
    }

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.tagBox}`}>
                {tags && tags.map((tag, index) => (
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
                <button className={`${styles.submitBtn}`} onClick={() => { setTagOpen(false); setTags(tags); }}>
                    완료
                </button>
            </div>
        </div>
    );
};

export default TagInput;