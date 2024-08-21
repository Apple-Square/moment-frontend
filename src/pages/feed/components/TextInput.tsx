import React from 'react';
import styles from "../css/TextInput.module.css";

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
    return (
        <div className={styles.textInput}>
            <textarea
                placeholder="내용을 입력하세요."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default TextInput;