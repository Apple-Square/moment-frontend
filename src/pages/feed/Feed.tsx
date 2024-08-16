import React from 'react';

interface FeedProps {
    author: string;
    img: string;
    contents: string;
}

const Feed:React.FC<FeedProps> = ({author, img, contents}) => {
    return (
        <div className="content">
            <h2>{author}</h2>
            <img src={img} alt={author} />
            <p>{contents}</p>
        </div>
    );
};

export default Feed;