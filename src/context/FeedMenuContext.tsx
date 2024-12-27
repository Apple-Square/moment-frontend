import { createContext, Dispatch, SetStateAction } from "react";

interface FeedMenuContextProps {
    feedMenuOpen: boolean;
    setFeedMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export const FeedMenuContext = createContext<FeedMenuContextProps>(
    {
        feedMenuOpen: false,
        setFeedMenuOpen: () => {}
    }
);