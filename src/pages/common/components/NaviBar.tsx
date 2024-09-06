import styles from '../css/NaviBar.module.css';

const NaviBar = () => {
    return (
        <div className={`${styles.naviBar}`}>
            <div>
                home
            </div>
            <div>
                chat
            </div>
            <div>
                add
            </div>
            <div>
                video
            </div>
            <div>
                profile
            </div>
        </div>
    );
}

export default NaviBar;