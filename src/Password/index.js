import React, { useEffect, useState } from 'react';
import './_index.scss';
import Swal from 'sweetalert2';
import axios from 'axios';

function CaseReport() {
  const [pass, setPass] = useState('');

  function submitCheck(tit) {
    Swal.fire({
      title: tit,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: '確定更改',
      denyButtonText: `取消更改`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('更改成功', '', 'success');
        submit();
      } else if (result.isDenied) {
        Swal.fire('已取消更改', '', 'info');
      }
    });
  }

  const submit = async () => {
    try {
      let res = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/application_edit/passWord`,
        { password: pass },
        {
          withCredentials: true,
        }
      );
      setPass('');
      console.log('pass', pass);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="passWordContainer">
      <div className="title">請輸入密碼(最長15):</div>
      <div>
        <input
          type="password"
          maxLength="15"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
          }}
        />
      </div>
      <div
        className="btn"
        onClick={() => {
          submitCheck('確認更改密碼?');
        }}
      >
        更改
      </div>
    </div>
  );
}

export default CaseReport;
