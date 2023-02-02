import React, { useEffect, useState } from 'react';
import './_index.scss';
import Swal from 'sweetalert2';
import axios from 'axios';
import GenerallyBtn from '../Btn/GenerallyBtn';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

function CaseReport() {
  const [getData, setGetData] = useState([]);
  const [pass, setPass] = useState('');
  const [passTow, setPassTow] = useState('');
  const [passThr, setPassThr] = useState([]);
  const [eye, setEye] = useState(false);
  const [eyeTwo, setEyeTwo] = useState(false);
  // const [eyeThr, setEyeThr] = useState(false);
  // const [eyeFour, setEyeFour] = useState(false);
  const [loading, setLoading] = useState(false);

  // 取得所有資料
  useEffect(() => {
    let getCampingData = async () => {
      let response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/application_edit/getPermissionsPassWord`,
        {
          withCredentials: true,
        }
      );
      setGetData(response.data.result);
      setPassThr(response.data.result);
      // console.log('object', data);
    };
    getCampingData();
  }, [loading]);

  function submitCheck(tit) {
    Swal.fire({
      title: tit,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: '確定更改',
      denyButtonText: `取消更改`,
      confirmButtonColor: '#f2ac33',
      denyButtonColor: '#ccc',
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

  function submitCheckTwo(tit, ind) {
    Swal.fire({
      title: tit,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: '確定更改',
      denyButtonText: `取消更改`,
      confirmButtonColor: '#f2ac33',
      denyButtonColor: '#ccc',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('更改成功', '', 'success');
        handleSubmit(ind);
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
      setPassTow('');
      // console.log('pass', pass);
    } catch (err) {
      console.log(err);
    }
  };

  const handleVal = (val, input, i) => {
    const newData = [...passThr];
    if (input === 'three') newData[i].valid1 = val;
    if (input === 'four') newData[i].valid2 = val;
    setPassThr(newData);
  };

  const handleSubmit = async (ind) => {
    try {
      let res = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/application_edit/permissionsPassWord`,
        { passThr, ind },
        {
          withCredentials: true,
        }
      );

      for (let i = 0; i < passThr.length; i++) {
        passThr[i].valid1 = '';
        passThr[i].valid2 = '';
      }
      setLoading(!loading);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="passWordContainer">
        <div className="tit">更改自己的密碼</div>
        <div className="passWordContain">
          <div>
            <div>請輸入新密碼:</div>
            <div>
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
            </div>
            <div>請再次輸入新密碼:</div>
            <div>
              <input
                type={eyeTwo ? 'text' : 'password'}
                maxLength="15"
                placeholder="密碼至多15字"
                value={passTow}
                onChange={(e) => {
                  setPassTow(e.target.value);
                }}
              />
              {eyeTwo ? (
                <AiFillEye
                  className="eye"
                  onClick={() => {
                    setEyeTwo(false);
                  }}
                />
              ) : (
                <AiFillEyeInvisible
                  className="eye"
                  onClick={() => {
                    setEyeTwo(true);
                  }}
                />
              )}
              <GenerallyBtn
                style={{ background: '#2c75c8', color: 'white' }}
                tit="更改"
                handleFn1={(fn1) => {
                  if (pass === passTow) {
                    submitCheck(fn1);
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: '密碼不一致',
                    });
                  }
                }}
                fn1="確認更改密碼?"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 密碼權限 */}
      <div className="unlockPasswordContainer">
        <div className="tit">開啟密碼已鎖住的使用者</div>
        <div className="unlockPassword">
          <table className="unlockPasswordContain">
            <thead>
              <tr>
                <th>使用者</th>
                <th>員工編號</th>
                <th>處理單位</th>
                <th colSpan={3} className="passwStart">
                  設置新密碼
                </th>
              </tr>
            </thead>

            {getData.length !== 0 ? (
              <tbody className="bodyHover">
                {getData.map((v, i) => {
                  return (
                    <tr className="body" key={i}>
                      <td>{v.name}</td>
                      <td>{v.code}</td>
                      <td>{v.unit}</td>
                      <td>
                        <div className="passwordInp">
                          <div>請輸入新密碼：</div>
                          <div className="center">
                            <input
                              type="text"
                              maxLength="15"
                              placeholder="密碼至多15字"
                              value={passThr[i].valid1}
                              onChange={(e) => {
                                handleVal(e.target.value, 'three', i);
                              }}
                            />
                            {/* {eyeThr ? (
                            <AiFillEye
                              className="eye"
                              onClick={() => {
                                setEyeThr(false);
                              }}
                            />
                          ) : (
                            <AiFillEyeInvisible
                              className="eye"
                              onClick={() => {
                                setEyeThr(true);
                              }}
                            />
                          )} */}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="passwordInp">
                          <div>請再次輸入一次新密碼：</div>
                          <div className="center">
                            <input
                              type="text"
                              maxLength="15"
                              placeholder="密碼至多15字"
                              value={passThr[i].valid2}
                              onChange={(e) => {
                                handleVal(e.target.value, 'four', i);
                              }}
                            />
                            {/* {eyeFour ? (
                            <AiFillEye
                              className="eye"
                              onClick={() => {
                                setEyeFour(false);
                              }}
                            />
                          ) : (
                            <AiFillEyeInvisible
                              className="eye"
                              onClick={() => {
                                setEyeFour(true);
                              }}
                            />
                          )} */}
                          </div>
                        </div>
                      </td>
                      <td>
                        <GenerallyBtn
                          style={{ background: '#2c75c8', color: 'white' }}
                          tit="更改"
                          handleFn1={(fn1) => {
                            if (
                              (passThr[i].valid1 === '' &&
                                passThr[i].valid2 === '') ||
                              passThr[i].valid1 !== passThr[i].valid2
                            ) {
                              Swal.fire({
                                icon: 'error',
                                title: '密碼欄位為空或密碼不一致',
                              });
                            } else {
                              submitCheckTwo(fn1, i);
                            }
                          }}
                          fn1="確認更改密碼?"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody className="noData">
                <tr>
                  <td colSpan={5} className="noTd">
                    目前沒有資料
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}

export default CaseReport;
