import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styles from './css/ToastNotification.module.css';


const MySwal = withReactContent(Swal);

/**
 *
 * @param type : "" | "success" | "error" | "warning" | "info" | "question"
 * @param text : string
 * @param milisecondtimer : number
 */
export const showToast = (type, text, milisecondtimer = 1000, titleFontSize = '18px', bodyFontSize = '14px') => {
    MySwal.fire({
        toast: true,
        position: 'top',
        icon: type,
        title: text,
        showConfirmButton: false,
        timer: milisecondtimer,
        timerProgressBar: true,
        customClass: {
            container: styles.container,
            popup: styles.popup,
            icon: styles.icon,
            title: styles.title, // title 스타일 클래스 유지
            htmlContainer: styles.swal2HtmlContainer, // 본문 스타일 클래스 유지
            actions: styles.swal2Actions,
            confirmButton: styles.swal2ConfirmButton,
            cancelButton: styles.swal2CancelButton,
        },
        didOpen: (popup) => {
            const titleElement = popup.querySelector('.swal2-title') as HTMLElement | null;
            const htmlContainerElement = popup.querySelector('.swal2-html-container') as HTMLElement | null;

            // title 폰트 크기 설정
            if (titleElement && titleElement) {
                titleElement.style.fontSize = titleFontSize;
            }

            // 본문 폰트 크기 설정
            if (htmlContainerElement) {
                htmlContainerElement.style.fontSize = bodyFontSize;
            }
        },
    });
};

export const showAlert = (type, text, titleFontSize = '18px', bodyFontSize = '14px') => {
    MySwal.fire({
        title: text,
        icon : type,
        allowOutsideClick: false,
        width : "300px",
        didOpen: (popup) => {
            const titleElement = popup.querySelector('.swal2-title') as HTMLElement | null;
            const htmlContainerElement = popup.querySelector('.swal2-html-container') as HTMLElement | null;

            // title 폰트 크기 설정
            if (titleElement && titleElement) {
                titleElement.style.fontSize = titleFontSize;
            }

            // 본문 폰트 크기 설정
            if (htmlContainerElement) {
                htmlContainerElement.style.fontSize = bodyFontSize;
            }
        },
    },)
};
