import { createContext, Dispatch, SetStateAction } from "react";

interface CommentModalContextProps {
    commentOpen: boolean;
    setCommentOpen: Dispatch<SetStateAction<boolean>>;
    target: number | null;
    setTarget: Dispatch<SetStateAction<number | null>>;
}

export const CommentModalContext = createContext<CommentModalContextProps>(
    {
        commentOpen: false,
        setCommentOpen: () => {},
        target: null,
        setTarget: () => {}
    }
);
