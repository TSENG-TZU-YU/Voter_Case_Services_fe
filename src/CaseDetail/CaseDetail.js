import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../utils/use_auth';

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
  let Scroll = parseInt(params.get('scroll'));
  const doScrollPage = () => {
    setScrollPage(!scrollPage);
  };
  const { member } = useAuth();
  const [uploadPage, setUploadPage] = useState(false);

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
  ];

  const navBtn1 = [
    {
      title: '上傳文件',
      url: `uploadPage/${num}?id=${ID}&HId=${HId}&user=${User}&page=${page}&scroll=3`,
    },
  ];

  useEffect(() => {
    //接案人與處理人皆可看到文件
    if (member.name === HId || member.name === User) {
      setUploadPage(true);
    } else {
      setUploadPage(false);
    }
  }, []);

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
            {navBtn.map((v, i) => {
              return (
                <li key={uuidv4()}>
                  <NavLink
                    to={v.url}
                    // className={(nav) =>console.log(i, v.act === i && nav.isActive)
                    //  }
                    className={`linkPad ${Scroll === i + 1 ? 'act' : ''}`}
                    onClick={doScrollPage}
                  >
                    {v.title}
                  </NavLink>
                </li>
              );
            })}
            {/* 是處理人才能看到文件 */}
            {uploadPage ? (
              <>
                {navBtn1.map((v, i) => {
                  return (
                    <li key={uuidv4()}>
                      <NavLink
                        to={v.url}
                        // className={(nav) =>console.log(i, v.act === i && nav.isActive)
                        //  }
                        className={`linkPad ${Scroll === 3 ? 'act' : ''}`}
                        onClick={doScrollPage}
                      >
                        {v.title}
                      </NavLink>
                    </li>
                  );
                })}
              </>
            ) : (
              ''
            )}
          </ul>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}

export default CaseDetail;
