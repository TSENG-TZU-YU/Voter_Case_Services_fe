import React from 'react';
import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';

export const ViewCheck = (tit, fun, i, fun2, i2) => {
  //   const navigate = useNavigate();

  Swal.fire({
    icon: 'success',
    title: tit,
  }).then(function () {
    fun(!i);
    if (fun2 !== undefined && i2 !== undefined) {
      fun2(i2);
    }

    // navigate(`/header`);
  });

  return;
};
