import React, { useEffect, useState } from 'react';
import '../styles/logIn/_logIn.scss';
import { AiFillHome, AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import { FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

//hook
import { useAuth } from '../utils/use_auth';

function LogIn() {
  const navigate = useNavigate();
  const [login, setIogin] = useState([{ company: '', no: '', password: '' }]);
  const { member, setMember, isLogin, setIsLogin } = useAuth();
  const [unit, setUnit] = useState([]);
  const [eye, setEye] = useState(false);
  const [isLock, setIsLock] = useState('0');
  const [passErr, setPassErr] = useState(false);

  // const [check, setCheck] = useState([]);

  const doLogin = (val, input) => {
    let newData = [...login];
    // if (input === 'company') newData[0].company = val;
    if (input === 'no') newData[0].no = val;
    if (input === 'password') newData[0].password = val;
  };

  useEffect(() => {
    async function unit() {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/login/unit`
        );
        setUnit(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    unit();
  }, [isLock]);

  // 檢查登入sweet
  function submitCheck() {
    if (
      // login[0].company === '' ||
      login[0].no === '' ||
      login[0].password === ''
    ) {
      Swal.fire({
        icon: 'error',
        title: '請填寫完整資訊',
      });
    }
    if (
      // login[0].company !== '' &&
      login[0].no !== '' &&
      login[0].password !== ''
    ) {
      submit();
    }
  }

  const submit = async () => {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/login`,
        { ...login[0] },
        {
          withCredentials: true,
        }
      );
      setMember(res.data);
      localStorage.setItem('memberID', login[0].no);
      Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: '登入成功',
        showConfirmButton: false,
        timer: 800,
      });
      record();
      navigate('/casemgmt/header');
    } catch (err) {
      console.log(err.response.data);
      record_err();
      if (err.response.data.message === '帳號已鎖住，請聯絡管理員處理') {
        Swal.fire({
          icon: 'error',
          title: '帳號已鎖住，請聯絡管理員處理',
        });
        setPassErr(true);
        setIsLock(4);
      }
      if (err.response.data.message === '員編或密碼錯誤') {
        Swal.fire({
          icon: 'error',
          title: '單位、員編或密碼錯誤',
        });
        setPassErr(true);
        setIsLock(err.response.data.isLock + 1);
      }
      if (err.response.data.message === '單位錯誤') {
        Swal.fire({
          icon: 'error',
          title: '單位、員編或密碼錯誤',
        });
      }
    }
  };

  const record = async () => {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/audit/login`,
        { ...login[0] }
      );
    } catch (err) {
      console.log(err);
    }
  };
  const record_err = async () => {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/audit/login/err`,
        { ...login[0] }
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="logInContainer">
        <div className="container">
          <div className="title">選民服務案件管理系統</div>
          <div className="inputContainer">
            {/* <div className="inputContain">
              <AiFillHome className="icons" />
              <select
                name="company"
                onChange={(e) => {
                  doLogin(e.target.value, 'company');
                }}
              >
                <option value="0">請選擇單位</option>
                {unit.map((v) => {
                  return <option key={v.id}>{v.name}</option>;
                })}
              </select>
            </div> */}
            <div className="inputContain">
              <BsPersonCircle className="icons" />
              <input
                name="no"
                type="text"
                placeholder="員工編號"
                onChange={(e) => {
                  doLogin(e.target.value, 'no');
                }}
              />
            </div>
            <div className="inputContain">
              <FaLock className="icons" />
              <input
                name="password"
                type={eye ? 'text' : 'password'}
                placeholder="密碼至多15字"
                maxLength={15}
                onChange={(e) => {
                  doLogin(e.target.value, 'password');
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
            {passErr ? (
              <div className="errPass">密碼錯誤次數 {isLock}/4</div>
            ) : (
              ''
            )}

            <button onClick={submitCheck}>登入</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogIn;
