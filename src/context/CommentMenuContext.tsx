import { createContext, Dispatch, SetStateAction } from "react";

interface CommentMenuContextProps {
    targetComment: number | null;
    setTargetComment: Dispatch<SetStateAction<number | null>>;
}

export const CommentMenuContext = createContext<CommentMenuContextProps>(
    {
        targetComment: null,
        setTargetComment: () => {}
    }
);