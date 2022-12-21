import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const SubmitCheck = (tit, submitFile) => {
  const navigate = useNavigate();
  // 送出申請表sweet
  Swal.fire({
    title: tit,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: '確定送出',
    denyButtonText: `取消送出`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire('送出成功', '', 'success');
      submitFile();
      navigate('/header');
    } else if (result.isDenied) {
      Swal.fire('已取消送出', '', 'info');
    }
  });
  return <></>;
};
// export const successToast = (title, confirmBtnName) => {
//   Swal.fire({
//     customClass: {
//       confirmButton: 'btn btn-primary',
//     },
//     confirm: true,
//     icon: 'success',
//     title: title,
//     showConfirmButton: true,
//     confirmButtonText: confirmBtnName,
//     confirmButtonColor: '#8CD4F5',
//     buttonsStyling: false,
//     color: '#00323d',
//     background: '#f2f2f2',
//     iconColor: '#86a8ae',
//     timer: 2000,
//     position: 'top',
//   });
// };
// export default SubmitCheck;
