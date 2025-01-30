import { createContext, Dispatch, SetStateAction } from "react";

interface FeedMenuContextProps {
    targetFeed: number | null;
    setTargetFeed: Dispatch<SetStateAction<number | null>>;
}

export const FeedMenuContext = createContext<FeedMenuContextProps>(
    {
        targetFeed: null,
        setTargetFeed: () => {}
    }
);