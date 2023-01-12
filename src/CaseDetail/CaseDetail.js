import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FaArrowLeft } from 'react-icons/fa';

import '../styles/caseDetail/_caseDetail.scss';

function CaseDetail({ setScrollPage, scrollPage }) {
  const { num } = useParams();
  const location = useLocation();

  let params = new URLSearchParams(location.search);
  let ID = params.get('id');
  let HId = params.get('HId');
  let User = params.get('user');
  let Sender = params.get('sender');
  let page = parseInt(params.get('page'));
  const doScrollPage = () => {
    setScrollPage(!scrollPage);
  };

  //使用者資料
  const navBtn = [
    {
      title: '申請表',
      url: `application/${num}?id=${ID}&HId=${HId}&user=${User}&sender=${Sender}&page=${page}&scroll=1`,
    },
    // { title: '討論區', url: `chatPage/${num}?id=${ID}` },
    {
      title: '案件處理情形',
      // url: `ProcessingStatus/${num}?id=${ID}&HId=${HId}&user=${User}&page=${page}`,
      url: `application/${num}?id=${ID}&HId=${HId}&user=${User}&sender=${Sender}&page=${page}&scroll=2`,
    },
    {
      title: '上傳文件',
      url: `uploadPage/${num}?id=${ID}&HId=${HId}&user=${User}&page=${page}`,
    },
  ];

  // console.log('num', page === 1);
  return (
    <div className="caseDetailContainer">
      <Link
        to={
          page === 1
            ? '/header/caseManagement'
            : '/header/caseManagement_handler'
        }
        className="prePage"
      >
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
                    onClick={doScrollPage}
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
