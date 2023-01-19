import React, { useEffect, useState } from 'react';
import './_index.scss';
import Swal from 'sweetalert2';
import axios from 'axios';
import GenerallyBtn from '../Btn/GenerallyBtn';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

function CaseReport() {
  const [pass, setPass] = useState('');
  const [eye, setEye] = useState(false);

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
    <div className="passWordContainer contents18">
      <div>請輸入密碼:</div>
      <div className="">
        <input
          type={eye ? 'text' : 'password'}
          maxLength="15"
          placeholder="密碼至多15字"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
          }}
        />
        {eye ? (
          <AiFillEye
            className="eye"
            onClick={() => {
              setEye(false);
            }}
          />
        ) : (
          <AiFillEyeInvisible
            className="eye"
            onClick={() => {
              setEye(true);
            }}
          />
        )}
        <GenerallyBtn
          style={{ background: '#2c75c8', color: 'white' }}
          tit="更改"
          handleFn1={submitCheck}
          fn1="確認更改密碼?"
        />
      </div>
    </div>
  );
}

export default CaseReport;
