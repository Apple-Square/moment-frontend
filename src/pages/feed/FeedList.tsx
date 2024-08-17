import React from 'react';
import Feed from './Feed';

const FeedList:React.FC = () => {
    return (
        <div>
            <Feed
                author='홍길동'
                img=''
                contents='테스트다!'
            />
        </div>
    );
};

export default FeedList;