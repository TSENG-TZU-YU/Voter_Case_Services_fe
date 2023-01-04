import React, { useEffect, useState } from 'react';

import './_index.scss';
import { NavLink, Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//react-icons
import { HiPencilAlt } from 'react-icons/hi';
import { RiFileTextLine } from 'react-icons/ri';
import { RiPhoneFindFill } from 'react-icons/ri';
import { MdOutlineLogout } from 'react-icons/md';

//hook
import { useAuth } from '../utils/use_auth';

function Header({
  setApplication,
  application,
  caseManagement,
  setCaseManagement,
  setTrial,
  trial,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  let params = new URLSearchParams(location.search);
  let page = params.get('page');

  //使用者資料
  const { member, setMember } = useAuth();

  //樣式
  // const [appLink1, setAppLink1] = useState(false);
  // const [appLink2, setAppLink2] = useState(false);

  //權限
  const [user, setUser] = useState(false);

  const [handler, setHandler] = useState(false);

  const [manage, setManage] = useState(false);

  const [active, setActive] = useState(false);

  //會員登入狀態判斷
  useEffect(() => {
    async function getMember() {
      try {
        // console.log('檢查是否登入');
        let response = await axios.get(`http://localhost:3001/api/login/auth`, {
          withCredentials: true,
        });

        setMember(response.data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    }
    getMember();

    if (member.permissions_id === 1) {
      setUser(true);
    }
    if (member.permissions_id === 2) {
      setUser(true);
      setHandler(true);
    }
    if (member.permissions_id === 3) {
      setHandler(true);
    }
    if (member.permissions_id === 4 || member.manage === 1) {
      setManage(true);
    }

    //刷新後會員權限無法渲染 需要增加member.permissions_id?
  }, [member.permissions_id]);

  const logOut = async () => {
    try {
      let res = await axios.get('http://localhost:3001/api/logout');
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log('page', page);
  }, [page]);

  //顯示樣式
  // const app = () => {
  //   if (caseManagement || trial) {
  //     setCaseManagement(false);
  //     setTrial(false);
  //   }

  //   setApplication(true);
  // };
  // const cas = () => {
  //   if (application || trial) {
  //     setApplication(false);
  //     setTrial(false);
  //   }
  //   setCaseManagement(true);
  // };
  // const tri = () => {
  //   if (application || caseManagement) {
  //     setApplication(false);
  //     setCaseManagement(false);
  //   }
  //   setTrial(true);
  // };

  //顯示統計
  const act = () => {
    setActive(true);
  };
  const acf = () => {
    setActive(false);
  };

  const title1 = [
    { tit: '申請表新增' },
    { tit: '申請紀錄查詢' },
    { tit: '案件審理作業' },
    { tit: '案件統計' },
    { tit: '申請類別統計' },
    { tit: '案件狀態統計' },
    { tit: '申請單位統計' },
    { tit: '處理人統計' },
    { tit: '權限管理' },
  ];

  return (
    <>
      <div className="navTop">
        <h3>選民案件服務系統</h3>
        <MdOutlineLogout size="30" onClick={logOut} />
      </div>
      <div className="between">
        <div className="navRight">
          <div>單位:{member.applicant_unit}</div>
          <div>姓名:{member.name}</div>
          <div>職別:{member.job}</div>

          {/* 使用者/主管 */}
          {user ? (
            <>
              <nav>
                <NavLink
                  to="application"
                  className={(nav) => (nav.isActive ? 'link' : '')}
                >
                  <div>
                    <HiPencilAlt size="20" />
                    申請表新增
                  </div>
                </NavLink>
              </nav>
              <nav>
                <NavLink
                  to="caseManagement"
                  className={(nav) => (nav.isActive || page == 1 ? 'link' : '')}
                >
                  <div className="" onClick={acf}>
                    <RiFileTextLine size="20" />
                    申請紀錄查詢
                  </div>
                </NavLink>
              </nav>
            </>
          ) : (
            ''
          )}
          {handler || manage ? (
            <>
              <nav>
                <NavLink
                  to="caseManagement_handler"
                  className={(nav) => (nav.isActive || page == 2 ? 'link' : '')}
                >
                  {/* 處理人/協理/主管 */}
                  <div
                    onClick={() => {
                      // tri();
                      acf();
                    }}
                  >
                    <RiPhoneFindFill size="20" />
                    案件審理作業
                  </div>
                </NavLink>
              </nav>
            </>
          ) : (
            ''
          )}
          {manage ? (
            <>
              <nav>
                <NavLink
                  to="countPage"
                  className={(nav) => (nav.isActive ? 'link' : '')}
                >
                  {/* 處理人/協理/主管 */}
                  <div className="" onClick={act}>
                    <RiPhoneFindFill size="20" />
                    案件統計
                  </div>
                </NavLink>
              </nav>
              {active ? (
                <div className="count">
                  <nav>
                    <NavLink
                      to="categoryPage"
                      className={(nav) => (nav.isActive ? 'link' : '')}
                    >
                      <div className="">
                        <RiPhoneFindFill size="20" />
                        申請類別統計
                      </div>
                    </NavLink>
                  </nav>
                  <nav>
                    <NavLink
                      to="statusPage"
                      className={(nav) => (nav.isActive ? 'link' : '')}
                    >
                      <div className="">
                        <RiPhoneFindFill size="20" />
                        案件狀態統計
                      </div>
                    </NavLink>
                  </nav>
                  <nav>
                    <NavLink
                      to="unitPage"
                      className={(nav) => (nav.isActive ? 'link' : '')}
                    >
                      <div className="">
                        <RiPhoneFindFill size="20" />
                        申請單位統計
                      </div>
                    </NavLink>
                  </nav>
                  <nav>
                    <NavLink
                      to="UserPage"
                      className={(nav) => (nav.isActive ? 'link' : '')}
                    >
                      <div className="">
                        <RiPhoneFindFill size="20" />
                        處理人統計
                      </div>
                    </NavLink>
                  </nav>
                </div>
              ) : (
                ''
              )}
              <nav>
                <NavLink
                  to="permissions"
                  className={(nav) => (nav.isActive ? 'link' : '')}
                >
                  {/* 處理人/協理/主管 */}
                  <div className="" onClick={acf}>
                    <RiPhoneFindFill size="20" />
                    權限管理
                  </div>
                </NavLink>
              </nav>
            </>
          ) : (
            ''
          )}
        </div>

        <div className="left">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Header;
