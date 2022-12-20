import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import axios from 'axios';

import { v4 as uuidv4 } from 'uuid';
import { FaArrowLeft } from 'react-icons/fa';

import '../styles/caseDetail/_caseDetail.scss';

function CaseDetail({ caseNum, setCaseNum }) {
  //使用者資料

  const navBtn = [
    { title: '申請表', url: `/header/caseDetail/application/${caseNum}` },
    { title: '討論區', url: `/header/caseDetail/chatPage/${caseNum}` },
    { title: '上傳文件', url: `/header/caseDetail/uploadPage/${caseNum}` },
  ];

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
