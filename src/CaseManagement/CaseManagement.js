import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/config';
import axios from 'axios';
import { useAuth } from '../utils/use_auth';
import _ from 'lodash';
import moment from 'moment';
import Swal from 'sweetalert2';

import '../styles/caseManagement/_caseManagement.scss';
import CategoryFilter from './Component/CategoryFilter.js';
import StatusFilter from './Component/StatusFilter.js';
import DateFilter from './Component/DateFilter.js';
import UnitFilter from './Component/UnitFilter.js';
import CheckStatePage from './Component/CheckStatePage.js';
import PaginationBar from './Component/PaginationBar';
import Loader from '../Loader';

import { FaEye } from 'react-icons/fa';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';

function CaseManagement() {
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
  // console.log('d', handlerNull);

  const { member, setMember } = useAuth();
  const [number, setNumber] = useState(true);
  const [time, setTime] = useState(true);
  const [checkState, setCheckState] = useState(false);
  const [dateRemind, setDateRemind] = useState('');
  const [maxDateValue, setMaxDateValue] = useState(nowDate);
  const [minDateValue, setMinDateValue] = useState(dateAgo);

  const [isLoading, setIsLoading] = useState(false);

  // 篩選
  const [nowStatus, setNowStatus] = useState('');
  const [nowCategory, setNowCategory] = useState('');
  const [nowUnit, setNowUnit] = useState('');
  const [maxDate, setMaxDate] = useState(nowDate);
  const [minDate, setMinDate] = useState(dateAgo);
  const [order, setOrder] = useState('');

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
        let response = await axios.get(`http://localhost:3001/api/login/auth`, {
          withCredentials: true,
        });
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

  // TODO:預設狀態及日期
  // 取得所有資料
  useEffect(() => {
    // setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 600);
    let getCampingData = async () => {
      let response = await axios.get(
        `${API_URL}/applicationData?category=${nowCategory}&state=${nowStatus}&unit=${nowUnit}&minDate=${minDate}&maxDate=${maxDate}&order=${order}`,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data.result);
      setAllData(response.data.result);
      setAllCategoryData(response.data.categoryResult);
      setAllUnitData(response.data.unitResult);
      setAllStatusData(response.data.statusResult);
    };
    getCampingData();
  }, [member, nowCategory, nowStatus, nowUnit, minDate, maxDate, order]);

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
          <div className="sortSelect">
            <div className="bothFilter">
              <CategoryFilter
                allCategoryData={allCategoryData}
                setNowCategory={setNowCategory}
              />
              <StatusFilter
                allStatusData={allStatusData}
                setNowStatus={setNowStatus}
                member={member}
              />
              <UnitFilter allUnit={allUnit} setNowUnit={setNowUnit} />
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

          <table className="caseContain">
            <thead>
              <tr>
                <th></th>
                <th className="sortBtn">
                  案件編號
                  {number ? (
                    <MdArrowDropDown
                      className="arrow"
                      onClick={() => {
                        setOrder(1);
                        setNumber(false);
                      }}
                    />
                  ) : (
                    <MdArrowDropUp
                      className="arrow"
                      onClick={() => {
                        setOrder(2);
                        setNumber(true);
                      }}
                    />
                  )}
                </th>
                <th>申請單位</th>
                <th>申請人</th>
                <th>處理人</th>
                <th>申請類別</th>
                <th className="sortBtn">
                  申請時間
                  {time ? (
                    <MdArrowDropDown
                      className="arrow"
                      onClick={() => {
                        setOrder(3);
                        setTime(false);
                      }}
                    />
                  ) : (
                    <MdArrowDropUp
                      className="arrow"
                      onClick={() => {
                        setOrder(4);
                        setTime(true);
                      }}
                    />
                  )}
                </th>
                <th>申請狀態</th>
                <th></th>
                <th>需求進度</th>
              </tr>
            </thead>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {pageCase.length !== 0 ? (
                  <>
                    {pageCase.length > 0 &&
                      pageCase[pageNow - 1].map((v) => {
                        return (
                          <tbody key={uuidv4()}>
                            <tr>
                              <td>
                                {member.permissions_id === 3 &&
                                member.name === v.sender
                                  ? `轉件人 : ${v.handler}`
                                  : ''}
                              </td>
                              <td>{v.case_number}</td>
                              <td>{v.applicant_unit}</td>
                              <td>{v.user}</td>
                              <td>{v.handler}</td>
                              <td>{v.application_category}</td>
                              <td>{v.create_time}</td>
                              <td
                                // onClick={() => {
                                //   setCaseNum(v.case_number);
                                //   setCheckState(true);
                                //   handleHandleStatus(v.case_number);
                                //   setHandlerNull(v.handler);
                                // }}
                                className="view"
                              >
                                {v.name}
                              </td>
                              <td className="posClick">
                                <Link
                                  to={`/header/caseDetail/application/${v.case_number}?id=${v.id}&HId=${v.handler}&user=${v.user}&sender=${v.sender}&page=1`}
                                >
                                  <FaEye
                                    className={`icons ${
                                      v.name === '處理人評估中' &&
                                      member.permissions_id === 3
                                        ? 'eyeBcg'
                                        : ''
                                    }`}
                                    onClick={() => {
                                      // setCaseNum(v.case_number);
                                      // setCaseId(v.id);
                                      // setHandlerNull(v.handler);
                                      // setSender(v.sender);
                                      // if (
                                      //   v.name === '處理人評估中' &&
                                      //   member.permissions_id === 3
                                      // ) {
                                      //   handleChangeState(v.case_number, v.id);
                                      // }
                                    }}
                                  />
                                </Link>

                                {/* <div className="hadClick">NEW</div> */}
                              </td>
                              <td>
                                進度({v.cou}/{v.sum})
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                  </>
                ) : (
                  <div className="noData">
                    <div>目前沒有資料</div>
                  </div>
                )}
              </>
            )}
          </table>

          {/* 頁碼 */}
          {pageCase.length > 0 ? (
            <div className="page">
              <PaginationBar
                pageNow={pageNow}
                setPageNow={setPageNow}
                pageTotal={pageTotal}
              />
            </div>
          ) : (
            ''
          )}
          {/* 頁碼 end */}
        </div>
      </>
    </>
  );
}

export default CaseManagement;
