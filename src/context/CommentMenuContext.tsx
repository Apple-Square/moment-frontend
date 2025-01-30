import { createContext, Dispatch, SetStateAction } from "react";

interface CommentMenuContextProps {
    commentMenuOpen: boolean;
    setCommentMenuOpen: Dispatch<SetStateAction<boolean>>;
    targetComment: number | null;
    setTargetComment: Dispatch<SetStateAction<number | null>>;
}

export const CommentMenuContext = createContext<CommentMenuContextProps>(
    {
        commentMenuOpen: false,
        setCommentMenuOpen: () => {},
        targetComment: null,
        setTargetComment: () => {}
    }
);