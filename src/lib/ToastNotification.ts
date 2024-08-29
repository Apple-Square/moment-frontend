import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styles from '../component/css/ToastNotification.module.css';


const MySwal = withReactContent(Swal);

export const showToast = (type, title, milisecondtimer) => {
    MySwal.fire({
        toast: true,
        position: 'top',
        icon: type,
        title: title,
        showConfirmButton: false,
        timer: milisecondtimer,//1000이면 1000ms
        timerProgressBar: true,
        customClass: {
            container: styles.container,
            popup: styles.popup,
            icon: styles.icon,
            htmlContainer: styles.swal2HtmlContainer,
            actions: styles.swal2Actions,
            confirmButton: styles.swal2ConfirmButton,
            cancelButton: styles.swal2CancelButton,
        },
    });
};
