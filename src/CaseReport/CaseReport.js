import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/config';
import axios from 'axios';
import { useAuth } from '../utils/use_auth';
import _ from 'lodash';
import moment from 'moment';
import Swal from 'sweetalert2';

import './_CaseReport.scss';
import CategoryFilter from './Component/CategoryFilter.js';
import StatusFilter from './Component/StatusFilter.js';
import DateFilter from './Component/DateFilter.js';
import UnitFilter from './Component/UnitFilter.js';
import UnitHandlerFilter from './Component/UnitHandlerFilter.js';
// import CheckStatePage from './Component/CheckStatePage.js';
import PaginationBar from '../PaginationBar/PaginationBar';
import Loader from '../Loader';

import { FaEye } from 'react-icons/fa';
import { CgCloseR } from 'react-icons/cg';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import { GiCheckMark } from 'react-icons/gi';
import { BsToggleOff, BsToggleOn, BsFilterSquare } from 'react-icons/bs';

function CaseReport() {
  let nowDate = moment().format(`YYYY-MM-DD`);
  // 取前六個月
  let dateObj = new Date(nowDate);
  dateObj.setMonth(dateObj.getMonth() - 6);

  // 將日期轉換為指定格式的字串
  let newDateString = dateObj.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  let dateAgo = newDateString.replace(/\//g, '-');
  // console.log('d', handlerNull);litigant

  const { member, setMember } = useAuth();
  const [number, setNumber] = useState(true);
  const [time, setTime] = useState(true);
  const [source, setSource] = useState(true);
  const [category, setCategory] = useState(true);
  const [litigant, setLitigant] = useState(true);
  const [client, setClient] = useState(true);
  const [state, setState] = useState(true);
  const [called, setCalled] = useState(true);

  const [checkState, setCheckState] = useState(false);
  const [dateRemind, setDateRemind] = useState('');
  const [maxDateValue, setMaxDateValue] = useState(nowDate);
  const [minDateValue, setMinDateValue] = useState(dateAgo);

  const [isLoading, setIsLoading] = useState(false);
  const [mobileToggle, setMobileToggle] = useState(true);
  const [selClick, setSelClick] = useState(false);

  // 篩選
  const [nowStatus, setNowStatus] = useState(9);
  const [nowCategory, setNowCategory] = useState('');
  const [nowUnit, setNowUnit] = useState('');
  const [nowHUnit, setNowHUnit] = useState('');
  const [maxDate, setMaxDate] = useState(nowDate);
  const [minDate, setMinDate] = useState(dateAgo);
  const [order, setOrder] = useState('');
  const [nameSearch, setNameSearch] = useState('');

  // get data
  const [allData, setAllData] = useState([]);
  const [handleStData, setHandleStData] = useState([]);
  const [allUnit, setAllUnitData] = useState([]);
  const [allStatusData, setAllStatusData] = useState([]);
  const [allCategoryData, setAllCategoryData] = useState([]);

  // 案件處理情形
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMsgTrue, setSubmitMsgTrue] = useState(false);

  // 分頁
  const [pageCase, setPageCase] = useState([]);
  const [pageNow, setPageNow] = useState(1);
  const [perPage] = useState(7);
  const [pageTotal, setPageTotal] = useState(5);
  // 檢查會員
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
        // console.log(response.data);
        setMember(response.data);
      } catch (err) {
        console.log(err.response.data.message);
      }
    }
    getMember();
  }, []);

  // 案件處理情形
  // let handleHandleStatus = async (caseNum) => {
  //   let response = await axios.get(
  //     `${API_URL}/applicationData/getHandleStatus/${caseNum}`,
  //     {
  //       withCredentials: true,
  //     }
  //   );
  //   setHandleStData(response.data.result);
  //   // console.log('r',response.data.result)
  // };

  // post 案件處理情形
  // let handlePostStatus = async (e) => {
  //   e.preventDefault();

  //   if (submitMessage === '') return;

  //   let response = await axios.post(
  //     `${API_URL}/applicationData/postHandleStatus`,
  //     { caseNum, submitMessage },
  //     {
  //       withCredentials: true,
  //     }
  //   );

  //   // console.log('add', response.data);
  //   Swal.fire({
  //     icon: 'success',
  //     title: '訊息新增成功',
  //   }).then(function () {
  //     // navigate('/header/caseManagement_handler');
  //     setSubmitMessage('');
  //     setCheckState(false);
  //   });
  // };

  // 取得所有資料
  useEffect(() => {
    setIsLoading(true);

    let getCampingData = async () => {
      let response = await axios.get(
        `${API_URL}/applicationData/getReport?category=${nowCategory}&state=${nowStatus}&unit=${nowUnit}&minDate=${minDate}&maxDate=${maxDate}&order=${order}&HUnit=${nowHUnit}&search=${nameSearch}`,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data.result);
      setAllData(response.data.result);
      setAllCategoryData(response.data.categoryResult);
      setAllUnitData(response.data.unitResult);
      setAllStatusData(response.data.statusResult);
      setTimeout(() => {
        setIsLoading(false);
      });
    };
    getCampingData();
  }, [
    member.user,
    member.handler,
    member.manage,
    member.director,
    nowCategory,
    nowStatus,
    nowUnit,
    minDate,
    maxDate,
    order,
    nowHUnit,
    nameSearch,
  ]);

  useEffect(() => {
    const newPageCase = _.chunk(allData, perPage);
    setPageNow(1);
    setPageTotal(newPageCase.length);
    setPageCase(newPageCase);
  }, [allData]);

  // 審查 history
  let handleCaseHistory = async (caseNum) => {
    let response = await axios.get(
      `${API_URL}/applicationData/getCaseHistory/${caseNum}`,
      {
        withCredentials: true,
      }
    );
    setHandleStData(response.data.result);
  };

  // put 狀態 4 -> 5
  // let handleChangeState = async (caseNum, caseId) => {
  //   let response = await axios.post(
  //     `${API_URL}/applicationData/changeState/${caseNum}`,
  //     { handler: allData[0].handler, id: caseId },
  //     {
  //       withCredentials: true,
  //     }
  //   );
  //   // console(response.data.result);
  // };

  return (
    <>
      <>
        {/* {checkState ? (
            <CheckStatePage
              setCheckState={setCheckState}
              handleStData={handleStData}
              handlePostStatus={handlePostStatus}
              submitMsgTrue={submitMsgTrue}
              setSubmitMsgTrue={setSubmitMsgTrue}
              setSubmitMessage={setSubmitMessage}
              member={member}
              handlerNull={handlerNull}
            />
          ) : (
            ''
          )} */}
        <div className="caseContainer">
          {/* 篩選 */}
          <div className="p-view">
            <div className="sortSelect">
              <div className="bothFilter">
                <div className="marge5">
                  <CategoryFilter
                    allCategoryData={allCategoryData}
                    setNowCategory={setNowCategory}
                  />
                </div>
                <div className="marge5">
                  <StatusFilter
                    allStatusData={allStatusData}
                    setNowStatus={setNowStatus}
                    member={member}
                  />
                </div>

                <div className="marge5">
                  <UnitFilter allUnit={allUnit} setNowUnit={setNowUnit} />
                </div>
                <div className="marge5">
                  <UnitHandlerFilter
                    allUnit={allUnit}
                    setNowHUnit={setNowHUnit}
                  />
                </div>
              </div>
              <DateFilter
                dateRemind={dateRemind}
                setDateRemind={setDateRemind}
                setMaxDate={setMaxDate}
                setMinDate={setMinDate}
                maxDateValue={maxDateValue}
                setMaxDateValue={setMaxDateValue}
                minDateValue={minDateValue}
                setMinDateValue={setMinDateValue}
                dateAgo={dateAgo}
                nowDate={nowDate}
              />
            </div>
            <div className="inputSearch">
              <input
                className="searchInput"
                placeholder="Search.."
                type="text"
                maxLength={15}
                value={nameSearch}
                onChange={(e) => {
                  let textValue = e.target.value;
                  setNameSearch(textValue);
                }}
              />
            </div>
          </div>

          <div className="m-view">
            <div className="sortSelect">
              {selClick ? (
                <div className="mobileClose">
                  <CgCloseR
                    size={25}
                    className="click"
                    onClick={() => {
                      setSelClick(false);
                    }}
                  />
                </div>
              ) : (
                ''
              )}
              <div className={`selTrans ${selClick ? 'dflex' : 'dnone'}`}>
                <div className="both">
                  <div className="bothFilter">
                    <div className="marge5">
                      <CategoryFilter
                        allCategoryData={allCategoryData}
                        setNowCategory={setNowCategory}
                      />
                    </div>
                    <div className="margeNone">
                      <StatusFilter
                        allStatusData={allStatusData}
                        setNowStatus={setNowStatus}
                        member={member}
                        nowStatus={nowStatus}
                      />
                    </div>
                  </div>
                  <div className="bothFilter">
                    <div className="marge5">
                      <UnitFilter allUnit={allUnit} setNowUnit={setNowUnit} />
                    </div>
                    <div className="margeNone">
                      <UnitHandlerFilter
                        allUnit={allUnit}
                        setNowHUnit={setNowHUnit}
                      />
                    </div>
                  </div>
                </div>
                <DateFilter
                  dateRemind={dateRemind}
                  setDateRemind={setDateRemind}
                  setMaxDate={setMaxDate}
                  setMinDate={setMinDate}
                  maxDateValue={maxDateValue}
                  setMaxDateValue={setMaxDateValue}
                  minDateValue={minDateValue}
                  setMinDateValue={setMinDateValue}
                  dateAgo={dateAgo}
                  nowDate={nowDate}
                />
                <div className="inputSearch">
                  <input
                    className="searchInput"
                    placeholder="Search.."
                    type="text"
                    maxLength={15}
                    value={nameSearch}
                    onChange={(e) => {
                      let textValue = e.target.value;
                      setNameSearch(textValue);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mobileToggle ">
            <div>
              {selClick ? (
                ''
              ) : (
                <BsFilterSquare
                  size={25}
                  className="click"
                  onClick={() => {
                    setSelClick(true);
                  }}
                />
              )}
            </div>
            <div>
              {mobileToggle ? (
                <BsToggleOn
                  size="35"
                  onClick={() => {
                    setMobileToggle(false);
                  }}
                />
              ) : (
                <BsToggleOff
                  size="35"
                  onClick={() => {
                    setMobileToggle(true);
                  }}
                />
              )}{' '}
            </div>
          </div>
          <div className={`case ${selClick ? 'hightCalc' : 'pcCalc'}`}>
            <table
              className={`caseReport ${mobileToggle ? ' mobileCaseReport' : ''}
              `}
            >
              <thead>
                <tr>
                  <th>詳細資訊</th>
                  <th>
                    請託來源
                    {source ? (
                      <MdArrowDropDown
                        className="arrow"
                        onClick={() => {
                          setOrder(1);
                          setSource(false);
                        }}
                      />
                    ) : (
                      <MdArrowDropUp
                        className="arrow"
                        onClick={() => {
                          setOrder(2);
                          setSource(true);
                        }}
                      />
                    )}
                  </th>
                  <th>
                    案件類型
                    {category ? (
                      <MdArrowDropDown
                        className="arrow"
                        onClick={() => {
                          setOrder(3);
                          setCategory(false);
                        }}
                      />
                    ) : (
                      <MdArrowDropUp
                        className="arrow"
                        onClick={() => {
                          setOrder(4);
                          setCategory(true);
                        }}
                      />
                    )}
                  </th>
                  <th>
                    當事人
                    {litigant ? (
                      <MdArrowDropDown
                        className="arrow"
                        onClick={() => {
                          setOrder(5);
                          setLitigant(false);
                        }}
                      />
                    ) : (
                      <MdArrowDropUp
                        className="arrow"
                        onClick={() => {
                          setOrder(6);
                          setLitigant(true);
                        }}
                      />
                    )}
                  </th>
                  <th>
                    委託人
                    {client ? (
                      <MdArrowDropDown
                        className="arrow"
                        onClick={() => {
                          setOrder(7);
                          setClient(false);
                        }}
                      />
                    ) : (
                      <MdArrowDropUp
                        className="arrow"
                        onClick={() => {
                          setOrder(8);
                          setClient(true);
                        }}
                      />
                    )}
                  </th>
                  <th className="sortBtn">
                    接案時間
                    {time ? (
                      <MdArrowDropDown
                        className="arrow"
                        onClick={() => {
                          setOrder(9);
                          setTime(false);
                        }}
                      />
                    ) : (
                      <MdArrowDropUp
                        className="arrow"
                        onClick={() => {
                          setOrder(10);
                          setTime(true);
                        }}
                      />
                    )}
                  </th>
                  <th>
                    案件狀態
                    {state ? (
                      <MdArrowDropDown
                        className="arrow"
                        onClick={() => {
                          setOrder(11);
                          setState(false);
                        }}
                      />
                    ) : (
                      <MdArrowDropUp
                        className="arrow"
                        onClick={() => {
                          setOrder(12);
                          setState(true);
                        }}
                      />
                    )}
                  </th>
                  <th>
                    請委員/議員致電陳情人
                    {called ? (
                      <MdArrowDropDown
                        className="arrow"
                        onClick={() => {
                          setOrder(13);
                          setCalled(false);
                        }}
                      />
                    ) : (
                      <MdArrowDropUp
                        className="arrow"
                        onClick={() => {
                          setOrder(14);
                          setCalled(true);
                        }}
                      />
                    )}
                  </th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody className="noData">
                  <tr>
                    <td colSpan={10} className="noTd">
                      <Loader />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <>
                  {pageCase.length !== 0 ? (
                    <>
                      {pageCase.length > 0 &&
                        pageCase[pageNow - 1].map((v) => {
                          return (
                            <tbody key={uuidv4()} className="bodyMobile">
                              <tr>
                                <td data-title="詳細資訊" className="posClick">
                                  <Link
                                    to={`/casemgmt/header/caseDetail/application/${v.case_number}?id=${v.id}&HId=${v.handler}&user=${v.user}&sender=${v.sender}&page=1&scroll=1&report=1`}
                                  >
                                    <FaEye className="icons" />
                                  </Link>

                                  {/* <div className="hadClick">NEW</div> */}
                                </td>
                                <td data-title="請託來源">
                                  {v.application_source}
                                </td>
                                <td data-title="案件類型">
                                  {v.application_category}
                                </td>
                                <td data-title="當事人">{v.litigant}</td>
                                <td data-title="請託人">{v.client_name}</td>
                                <td data-title="接案時間">{v.create_time}</td>
                                <td data-title="案件狀態" className="view">
                                  {v.name}
                                </td>
                                <td data-title="請委員/議員致電陳情人">
                                  {v.called === 1 ? (
                                    <GiCheckMark className="tiTick" size="25" />
                                  ) : (
                                    ''
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          );
                        })}
                      {/* 頁碼 */}
                      <tbody className="noData">
                        <tr>
                          <td colSpan={10} className="noTd">
                            <div className="page">
                              <PaginationBar
                                pageNow={pageNow}
                                setPageNow={setPageNow}
                                pageTotal={pageTotal}
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                      {/* 頁碼 end */}
                    </>
                  ) : (
                    <tbody className="noData">
                      <tr>
                        <td colSpan={10} className="noTd">
                          目前沒有資料
                        </td>
                      </tr>
                    </tbody>
                  )}
                </>
              )}
            </table>
          </div>
        </div>
      </>
    </>
  );
}

export default CaseReport;
