import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/config';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../utils/use_auth';
import _ from 'lodash';

import '../styles/caseManagement/_caseManagement.scss';
import CategoryFilter from './Component/CategoryFilter.js';
import StatusFilter from './Component/StatusFilter.js';
import DateFilter from './Component/DateFilter.js';
import UnitFilter from './Component/UnitFilter.js';
import UnitHandlerFilter from './Component/UnitHandlerFilter.js';
// import CheckStatePage from './Component/CheckStatePage.js';
import PaginationBar from './Component/PaginationBar';
import moment from 'moment';

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

  const { member, setMember } = useAuth();
  const [number, setNumber] = useState(true);
  const [time, setTime] = useState(true);
  // const [checkState, setCheckState] = useState(false);
  const [dateRemind, setDateRemind] = useState('');
  const [maxDateValue, setMaxDateValue] = useState(nowDate);
  const [minDateValue, setMinDateValue] = useState(dateAgo);
  const [isLoading, setIsLoading] = useState(false);
  // 篩選
  const [nowStatus, setNowStatus] = useState('');
  const [nowCategory, setNowCategory] = useState('');
  const [nowUnit, setNowUnit] = useState('');
  const [nowHUnit, setNowHUnit] = useState('');
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
  // const [submitMessage, setSubmitMessage] = useState('');
  // const [submitMsgTrue, setSubmitMsgTrue] = useState(false);

  // 分頁
  const [pageCase, setPageCase] = useState([]);
  const [pageNow, setPageNow] = useState(1);
  const [perPage] = useState(7);
  const [pageTotal, setPageTotal] = useState(5);

  // TODO:預設狀態及日期
  // 取得所有資料
  useEffect(() => {
    setIsLoading(true);
    let getCampingData = async () => {
      try {
        let response = await axios.get(
          `${API_URL}/handler/applicationData?category=${nowCategory}&state=${nowStatus}&unit=${nowUnit}&minDate=${minDate}&maxDate=${maxDate}&order=${order}&HUnit=${nowHUnit}`,
          {
            withCredentials: true,
          }
        );
        setAllData(response.data.result);
        setAllCategoryData(response.data.categoryResult);
        setAllUnitData(response.data.unitResult);
        setAllStatusData(response.data.statusResult);
        setTimeout(() => {
          setIsLoading(false);
        });
      } catch (err) {
        console.log(err);
      }
    };

    getCampingData();
  }, [
    // member.user,
    // member.handler,
    // member.manage,
    // member.director,
    nowCategory,
    nowStatus,
    nowUnit,
    minDate,
    maxDate,
    order,
    nowHUnit,
  ]);

  useEffect(() => {
    const newPageCase = _.chunk(allData, perPage);
    setPageNow(1);
    setPageTotal(newPageCase.length);
    setPageCase(newPageCase);
  }, [allData]);

  // console.log('allData', allData);

  // useEffect(() => {

  // }, [allData]);
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
  // console.log('allData', member);

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
          </div>

          <div className="m-view">
            <div className="sortSelect">
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
                    />
                  </div>
                </div>
                <div className="bothFilter">
                  <div className="marge5">
                    <UnitFilter allUnit={allUnit} setNowUnit={setNowUnit} />
                  </div>
                  <div className="marge5None">
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
            </div>
          </div>

          <div className="case">
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
                  <th>詳細資訊</th>
                  <th>接案單位</th>
                  <th>接案人</th>
                  <th>處理單位</th>
                  <th>處理人</th>
                  <th>請託來源</th>
                  <th className="sortBtn">
                    接案時間
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
                  <th>接案狀態</th>
                  {/* <th>需求進度</th> */}
                </tr>
              </thead>
              {isLoading ? (
                <tbody className="noData">
                  <td colSpan={10} className="noTd">
                    <Loader />
                  </td>
                </tbody>
              ) : (
                <>
                  {pageCase.length !== 0 ? (
                    <>
                      {pageCase.length > 0 &&
                        pageCase[pageNow - 1].map((v) => {
                          return (
                            <tbody key={uuidv4()} className="body">
                              <tr>
                                <td>
                                  {member.handler === 1 &&
                                  member.name === v.sender
                                    ? `轉件人 : ${v.handler}`
                                    : ''}
                                </td>

                                <td>{v.case_number}</td>
                                <td className="posClick">
                                  <Link
                                    to={`/header/caseDetail/application/${v.case_number}?id=${v.id}&HId=${v.handler}&user=${v.user}&sender=${v.sender}&page=2`}
                                  >
                                    <FaEye
                                      className={`icons ${
                                        v.name === '處理人評估中' &&
                                        member.handler === 1
                                          ? 'eyeBcg'
                                          : ''
                                      }`}
                                    />
                                  </Link>

                                  {/* <div className="hadClick">NEW</div> */}
                                </td>
                                <td>{v.applicant_unit}</td>
                                <td>{v.user}</td>
                                <td>{v.unit}</td>
                                <td>{v.handler}</td>
                                <td>{v.application_category}</td>
                                <td>{v.create_time}</td>
                                <td className="view">{v.name}</td>

                                {/* <td>
                                  進度({v.cou}/{v.sum})
                                </td> */}
                              </tr>
                            </tbody>
                          );
                        })}

                      {/* 頁碼 */}
                      <tbody className="noData">
                        <td colSpan={10} className="noTd">
                          <div className="page">
                            <PaginationBar
                              pageNow={pageNow}
                              setPageNow={setPageNow}
                              pageTotal={pageTotal}
                            />
                          </div>
                        </td>
                      </tbody>
                      {/* 頁碼 end */}
                    </>
                  ) : (
                    <tbody className="noData">
                      <td colSpan={10} className="noTd">
                        目前沒有資料
                      </td>
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

export default CaseManagement;
