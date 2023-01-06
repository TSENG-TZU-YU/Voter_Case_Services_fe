import React, { useEffect, useState } from 'react';
import '../styles/logIn/_logIn.scss';
import { AiFillHome } from 'react-icons/ai';
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

  // const [check, setCheck] = useState([]);

  const doLogin = (val, input) => {
    let newData = [...login];
    if (input === 'company') newData[0].company = val;
    if (input === 'no') newData[0].no = val;
    if (input === 'password') newData[0].password = val;
  };

  useEffect(() => {
    async function unit() {
      try {
        let res = await axios.get('http://localhost:3001/api/login/unit');
        setUnit(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    unit();
  }, []);

  console.log('login', login);

  // 登入sweet
  function submitCheck() {
    if (
      login[0].company === '' ||
      login[0].no === '' ||
      login[0].password === ''
    ) {
      Swal.fire({
        icon: 'error',
        title: '請填寫完整資訊',
      });
    }
    if (
      login[0].company !== '' &&
      login[0].no !== '' &&
      login[0].password !== ''
    ) {
      submit();
    }
  }

  const submit = async () => {
    try {
      let res = await axios.post(
        'http://localhost:3001/api/login',
        { ...login[0] },
        {
          withCredentials: true,
        }
      );
      setMember(res.data);
      localStorage.setItem('memberID', login[0].no);
      navigate('/header');
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: '登入錯誤',
      });
    }
  };
  return (
    <>
      <div className="logInContainer">
        <div className="container">
          <div className="title">選民案件服務系統</div>
          <div className="inputContainer">
            <div className="inputContain">
              <AiFillHome className="icons" />
              <select
                name="company"
                onChange={(e) => {
                  doLogin(e.target.value, 'company');
                }}
              >
                <option value="0" selected>
                  --所屬單位--
                </option>
                {unit.map((v) => {
                  return <option key={v.id}>{v.name}</option>;
                })}
              </select>
            </div>
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
                type="password"
                placeholder="輸入密碼"
                onChange={(e) => {
                  doLogin(e.target.value, 'password');
                }}
              />
            </div>
            <button onClick={submitCheck}>登入</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogIn;
