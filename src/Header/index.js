import React, { useEffect, useState } from 'react';

import './_index.scss';
import { NavLink, Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/config';

//react-icons
import { HiPencilAlt, HiDocumentReport } from 'react-icons/hi';
import { RiFileTextLine, RiPhoneFindFill } from 'react-icons/ri';
import { MdOutlineLogout } from 'react-icons/md';
import { AiOutlineMenu, AiFillUnlock } from 'react-icons/ai';
import { IoBarChartSharp } from 'react-icons/io5';

//hook
import { useAuth } from '../utils/use_auth';

import HeaderMobile from '../HeaderMobile';

// 圖檔
import navTop from '../assets/call-center-2537390_1920.jpg';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  let params = new URLSearchParams(location.search);
  let page = params.get('page');

  const [mobileToggle, setMobileToggle] = useState(false);

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
        let response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/login/auth`,
          {
            withCredentials: true,
          }
        );

        setMember(response.data);
      } catch (err) {
        navigate('/');
        console.log(err.response.data.message);
      }
    }
    getMember();
    if (localStorage.getItem('memberID') === null) {
      navigate('/');
    }
    if (member.user === 1) {
      setUser(true);
    }
    // if (member.director === 1) {
    //   setUser(true);
    //   setHandler(true);
    // }
    if (member.handler === 1) {
      setHandler(true);
    }
    if (member.manage === 1) {
      setManage(true);
    }

    //刷新後會員權限無法渲染 需要增加member.permissions_id?
  }, [member.user, member.handler, member.manage, member.director]);
  // member.user, member.handler, member.manage, member.director
  const logOut = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/logout`);
      navigate('/');
      localStorage.setItem('memberID', '');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {}, [page]);

  const mobile = (e) => {
    //toggle
    setMobileToggle(!mobileToggle);
    e.stopPropagation();
  };

  //顯示統計
  const actoggle = () => {
    setActive(!active);
  };
  const acf = () => {
    setActive(false);
  };

  return (
    <>
      <div className="navTop">
        <div className="mobile">
          <AiOutlineMenu
            className="d-block d-md-none menu"
            size="35"
            onClick={mobile}
          />
          <div className="titleH3 ">選民案件服務系統</div>
        </div>
        <MdOutlineLogout className="logOut" size="30" onClick={logOut} />
      </div>
      <div className="between ">
        {/* 桌機版 */}
        <div className="navLeft d-none  d-md-block  ">
          <div>接案單位:{member.applicant_unit}</div>
          <div>姓名:{member.name}</div>
          {/* <div>職別:{member.job}</div> */}
          {handler || manage ? (
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
            </>
          ) : (
            ''
          )}
          {/* 使用者/主管 */}
          {user ? (
            <>
              <nav>
                <NavLink
                  to="caseManagement"
                  className={(nav) => (nav.isActive || page == 1 ? 'link' : '')}
                >
                  <div className="" onClick={acf}>
                    <RiFileTextLine size="20" />
                    案件紀錄查詢
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
                    案件處理作業
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
                  <div className="navFlex" onClick={actoggle}>
                    <IoBarChartSharp size="20" />
                    <span>案件統計</span>
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
                        {/* <RiPhoneFindFill size="20" /> */}
                        案件類別統計
                      </div>
                    </NavLink>
                  </nav>
                  <nav>
                    <NavLink
                      to="statusPage"
                      className={(nav) => (nav.isActive ? 'link' : '')}
                    >
                      <div className="">
                        {/* <RiPhoneFindFill size="20" /> */}
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
                        {/* <RiPhoneFindFill size="20" /> */}
                        申請單位統計
                      </div>
                    </NavLink>
                  </nav>
                  <nav>
                    <NavLink
                      to="AppUserPage"
                      className={(nav) => (nav.isActive ? 'link' : '')}
                    >
                      <div className="">
                        {/* <RiPhoneFindFill size="20" /> */}
                        申請人統計
                      </div>
                    </NavLink>
                  </nav>

                  <nav>
                    <NavLink
                      to="HandlerUnitPage"
                      className={(nav) => (nav.isActive ? 'link' : '')}
                    >
                      <div className="d-flex align-items-center">
                        {/* <RiPhoneFindFill size="20" /> */}
                        處理單位統計
                      </div>
                    </NavLink>
                  </nav>
                  <nav>
                    <NavLink
                      to="UserPage"
                      className={(nav) => (nav.isActive ? 'link' : '')}
                    >
                      <div className="">
                        {/* <RiPhoneFindFill size="20" /> */}
                        處理人統計
                      </div>
                    </NavLink>
                  </nav>
                </div>
              ) : (
                ''
              )}
              {/* <nav>
                <NavLink
                  to="permissions"
                  className={(nav) => (nav.isActive ? 'link' : '')}
                >
                  處理人/協理/主管
                  <div className="" onClick={acf}>
                    <RiPhoneFindFill size="20" />
                    權限管理
                  </div>
                </NavLink>
              </nav> */}
            </>
          ) : (
            ''
          )}
          <nav>
            <NavLink
              to="caseReport"
              className={(nav) => (nav.isActive ? 'link' : '')}
            >
              <div className="" onClick={acf}>
                <HiDocumentReport size="20" />
                結案報表
              </div>
            </NavLink>
          </nav>
          <nav>
            <NavLink
              to="permissions"
              className={(nav) => (nav.isActive ? 'link' : '')}
            >
              <div className="" onClick={acf}>
                <AiFillUnlock size="20" />
                密碼更改
              </div>
            </NavLink>
          </nav>
        </div>
        {/* 桌機版 end*/}
        {/* 手機版 */}
        <HeaderMobile
          mobileToggle={mobileToggle}
          setMobileToggle={setMobileToggle}
        />
        {/* 手機版 end*/}
        <div className="navRight">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Header;
