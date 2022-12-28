import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FaArrowLeft } from 'react-icons/fa';

import '../styles/caseDetail/_caseDetail.scss';

function CaseDetail({ caseNum, setCaseNum }) {
  // 把網址上的 :detailedID 拿出來
  const { num } = useParams();
  // 當 URL 網址改變時useState()會返回一個新的包含有關目前URL的狀態和位置的物件函數。每當URL網址有變更，則 useLocation 資訊也將更新
  const location = useLocation();
  // 從網址上抓到關鍵字
  let params = new URLSearchParams(location.search);
  let ID = params.get('id');
  //使用者資料
  const navBtn = [
    { title: '申請表', url: `application/${num}?id=${ID}` },
    { title: '討論區', url: `chatPage/${num}?id=${ID}` },
    { title: '上傳文件', url: `uploadPage/${num}?id=${ID}` },
  ];

  console.log('num', num);
  return (
    <div className="caseDetailContainer">
      <Link to="/header" className="prePage">
        <FaArrowLeft className="preIcon" /> <span>返回列表頁</span>
      </Link>

      <div className="caseDetailContain">
        <nav>
          <ul>
            {navBtn.map((v) => {
              return (
                <li key={uuidv4()}>
                  <NavLink
                    to={v.url}
                    className={`linkPad ${(nav) =>
                      nav.isActive ? 'active' : ''}`}
                  >
                    {v.title}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}

export default CaseDetail;
