import React, { useEffect } from 'react';
import './_index.scss';
import axios from 'axios';
import { API_URL } from '../utils/config';

//hook
import { useAuth } from '../utils/use_auth';

function HeaderLeft() {
  //使用者資料
  const { member, setMember } = useAuth();
  //會員登入狀態判斷
  useEffect(() => {
    async function getMember() {
      try {
        // console.log('檢查是否登入');
        let response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/login/auth`,
          {
            withCredentials: true,
          }
        );

        setMember(response.data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    }
    // getMember();
  }, [member.user, member.handler, member.manage, member.director]);
  return <div className="background"></div>;
}

export default HeaderLeft;
