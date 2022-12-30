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
  const [login, setIogin] = useState([]);
  const { member, setMember, isLogin, setIsLogin } = useAuth();
  const [unit, setUnit] = useState([]);

  // const [check, setCheck] = useState([]);

  const doLogin = (e) => {
    setIogin({ ...login, [e.target.name]: e.target.value });
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

  const submit = async () => {
    try {
      let res = await axios.post('http://localhost:3001/api/login', login, {
        withCredentials: true,
      });
      navigate('/header');
      setMember(res.data);
      console.log(res.data);
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
              <select name="company" onChange={doLogin}>
                <option value="0" selected >
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
                onChange={doLogin}
              />
            </div>
            <div className="inputContain">
              <FaLock className="icons" />
              <input
                name="password"
                type="text"
                placeholder="輸入密碼"
                onChange={doLogin}
              />
            </div>
            <button onClick={submit}>登入</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogIn;
