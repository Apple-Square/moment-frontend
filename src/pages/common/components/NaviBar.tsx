import React from 'react';
import styles from '../css/NaviBar.module.css';
import SvgChat from './SvgChat';
import SvgHome from './SvgHome';
import SvgNew from './SvgNew';
import SvgProfile from './SvgProfile';
import SvgVideopost from './SvgVideopost';
import { useNavigate } from 'react-router-dom';

const NaviBar:React.FC = () => {
    const navi = useNavigate();

    const handleClickHome = () => {
        navi('/');        
    }
    const handleClickChat = () => {
        navi('/chat/');
    }
    const handleClickNewPost = () => {
        navi('/feed/AddFeed');
    }
    const handleClickVideo = () => {
        navi('/');
    }
    const handleClickProfile = () => {
        navi('auth/');
    }

    return (
        <div className={`${styles.naviBar}`}>
            <div>
                <SvgHome fill='gray' onClick={handleClickHome} />
            </div>
            <div>
                <SvgChat fill='gray' onClick={handleClickChat} />
            </div>
            <div>
                <SvgNew fill='gray' onClick={handleClickNewPost} />
            </div>
            <div>
                <SvgVideopost stroke='gray' onClick={handleClickVideo} />
            </div>
            <div>
                <SvgProfile fill='gray' onClick={handleClickProfile} />
            </div>
        </div>
    );
}

export default NaviBar;