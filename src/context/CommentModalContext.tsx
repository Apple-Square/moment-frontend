import { createContext, Dispatch, SetStateAction } from "react";

interface CommentModalContextProps {
    commentOpen: boolean;
    setCommentOpen: Dispatch<SetStateAction<boolean>>;
}

export const CommentModalContext = createContext<CommentModalContextProps>(
    {
        commentOpen: false,
        setCommentOpen: () => {}
    }
);