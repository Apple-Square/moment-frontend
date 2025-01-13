import styles from '../css/TitleHeader.module.css';
import SvgSearch from './SvgSearch';

const TitleHeader = () => {
    return (
        <div className={`${styles.titleheader}`}>
            <div className={`${styles.title}`}>
                <h1>moment</h1>
            </div>
            {/* <div className={`${styles.searchBtn}`}>
                <SvgSearch fill='gray' />
            </div> */}
        </div>
    );
}

export default TitleHeader;