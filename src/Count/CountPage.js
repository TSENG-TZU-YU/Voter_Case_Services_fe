import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { API_URL } from '../utils/config';
import axios from 'axios';
import { useAuth } from '../utils/use_auth';
import moment from 'moment';

// import '../styles/caseManagement/_caseManagement.scss';
import '../styles/count/_countPage.scss';
import CategoryFilter from './Component/CategoryFilter.js';
import StatusFilter from './Component/StatusFilter.js';
import DateFilter from './Component/DateFilter.js';
import UnitFilter from './Component/UnitFilter.js';
import HandlerFilter from './Component/HandlerFilter.js';
import UserFilter from './Component/UserFilter.js';
import UserUnitFilter from './Component/UserUnitFilter.js';

import Loader from '../Loader';

// function CountPage({ setCaseNum, setCaseId, setHandlerNull, setSender }) {
function CountPage() {
  let nowDate = moment().format(`YYYY-MM-DD`);
  // 取前六個月 ISO
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
  const [dateRemind, setDateRemind] = useState('');
  const [maxDateValue, setMaxDateValue] = useState(nowDate);
  const [minDateValue, setMinDateValue] = useState(dateAgo);
  const [unitChange, setUnitChange] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // 篩選
  const [nowStatus, setNowStatus] = useState('');
  const [nowCategory, setNowCategory] = useState('');
  const [nowUnit, setNowUnit] = useState('');
  const [maxDate, setMaxDate] = useState(nowDate);
  const [minDate, setMinDate] = useState(dateAgo);
  // const [finish, setFinish] = useState('');
  const [handler, setHandler] = useState('');
  const [nowUser, setNowUser] = useState('');
  const [nowUserUnit, setNowUserUnit] = useState('');

  // get data
  const [allUnit, setAllUnitData] = useState([]);
  const [allStatusData, setAllStatusData] = useState([]);
  const [countStatusData, setCountStatusData] = useState([]);
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [allHandlerData, setAllHandlerData] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [userData, setuserData] = useState([]);

  // get total
  const [allTotal, setAllTotal] = useState('');
  const [total, setTotal] = useState('');
  const [stateTtl, setStateTtl] = useState([]);
  const [categoryTtl, setCategoryTtl] = useState([]);
  const [unitTtl, setUnitTtl] = useState([]);
  const [handlerTtl, setHandlerTtl] = useState([]);
  const [userTtl, setUserTtl] = useState([]);

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

  // 取得所有資料
  useEffect(() => {
    setIsLoading(true);
    let getAllData = async () => {
      let response = await axios.get(
        `${API_URL}/applicationData/getAssistantAllApp?category=${nowCategory}&state=${nowStatus}&unit=${nowUnit}&minDate=${minDate}&maxDate=${maxDate}&handler=${handler}&user=${nowUser}&userUnit=${nowUserUnit}`,
        {
          withCredentials: true,
        }
      );
      setAllCategoryData(response.data.categoryResult);
      setAllUnitData(response.data.unitResult);
      setAllStatusData(response.data.statusResult);
      setCountStatusData(response.data.statusResult.splice(1));
      setAllHandlerData(response.data.handlerResult);
      setAllUserData(response.data.userResult);
      setuserData(response.data.AllUserResult);

      // total
      setAllTotal(response.data.pagination.allTotal);
      setTotal(response.data.pagination.total);
      setStateTtl(response.data.pagination.counts);
      setCategoryTtl(response.data.pagination.categoryCounts);
      setUnitTtl(response.data.pagination.unitCounts);
      setHandlerTtl(response.data.pagination.handlerCounts);
      setUserTtl(response.data.pagination.userCounts);
      // console.log('object',allStatusData);
    };
    getAllData();
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
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
    handler,
    nowUser,
    nowUserUnit,
  ]);

  // %
  const percent = (ttl, num) => {
    let p = Math.round((parseInt(num) / parseInt(ttl)) * 10000) / 100;
    return p;
  };

  let handleNull = '';
  for (let i = 0; i < handlerTtl.length; i++) {
    // console.log(handlerTtl[i]['']);
    if (Object.keys(handlerTtl[i])[0] === '') {
      handleNull = handlerTtl[i][''];
    }
  }
  // console.log('v', handleNull);

  // const sortOption = [
  //   { id: '12', name: '案件已完成' },
  //   { id: '2', name: '案件未完成' },
  // ];
  // // state name
  // const nowSt = (arr, now) => {
  //   if (now === '') return;

  //   let st = arr.filter((v) => {
  //     if (parseInt(v.id) === parseInt(now)) {
  //       return v.name;
  //     }
  //   });
  //   return st[0].name;
  // };

  return (
    <>
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
              countStatusData={countStatusData}
            />
            <UnitFilter allUnit={allUnit} setNowUnit={setNowUnit} />
            <HandlerFilter
              setHandler={setHandler}
              allHandlerData={allHandlerData}
            />
          </div>
        </div>
        <div className="userFlex">
          <div className="userSort">
            <div>申請人：</div>
            <UserUnitFilter
              allUnit={allUnit}
              setNowUnit={setNowUnit}
              setNowUserUnit={setNowUserUnit}
              setNowUser={setNowUser}
              setUnitChange={setUnitChange}
            />
            {unitChange ? (
              <UserFilter setNowUser={setNowUser} allUserData={allUserData} />
            ) : (
              ''
            )}
          </div>
          <div className="userSort">
            <div>申請日期：</div>
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

        <hr />

        {/* 統計 */}
        {isLoading ? (
          <Loader />
        ) : (
          <div className="allConutContainer">
            <div className="d-flex">
              <div className="allTit">總申請案件 ： {allTotal} 件</div>
              <div className="allTit">搜尋件數 ： {total} 件</div>
            </div>

            {nowCategory ||
            nowStatus ||
            nowUnit ||
            minDate ||
            maxDate ||
            handler ||
            nowUser ? (
              <>
                {/* 總計% */}
                {/* <div className="stateTit">搜尋的條件(總件數的%)</div>
              <table className="countContainer">
                <thead>
                  <tr>
                    <th>申請單位</th>
                    <th>申請人</th>
                    <th>處理人</th>
                    <th>申請類別</th>
                    <th>申請時間</th>
                    <th>申請狀態</th>
                    <th>需求進度</th>
                    <th>總%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{nowUnit}</td>
                    <td>{nowSt(allUserData, nowUser)}</td>
                    <td>{handler}</td>
                    <td>{nowCategory}</td>
                    <td>
                      {minDate} {minDate || maxDate ? '至' : ''} {maxDate}
                    </td>
                    <td>{nowSt(allStatusData, nowStatus)}</td>
                    <td>{nowSt(sortOption, finish)}</td>
                    <td>{percent(allTotal, total)}%</td>
                  </tr>
                </tbody>
              </table> */}

                {/* 申請類別% (搜尋件數的%)*/}
                <>
                  <div className="stateTit">申請類別</div>
                  <table className="countContainer">
                    <thead>
                      <tr>
                        <th></th>
                        {allCategoryData.map((v) => {
                          return <th key={uuidv4()}>{v.name}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {/* 件數 */}
                      <tr>
                        <th>案件量</th>
                        {allCategoryData.map((v, i) => {
                          let arr = categoryTtl.filter(
                            (val) => Object.keys(val)[0] === v.name
                          );
                          return (
                            <td key={i}>
                              {arr[0] !== undefined
                                ? `${arr[0][Object.keys(arr[0])]} 件`
                                : '0 件'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* %% */}
                      <tr>
                        <th>案件%</th>
                        {allCategoryData.map((v, i) => {
                          let arr = categoryTtl.filter(
                            (val) => Object.keys(val)[0] === v.name
                          );
                          return (
                            <td key={i}>
                              {arr[0] !== undefined
                                ? `${percent(
                                    total,
                                    arr[0][Object.keys(arr[0])]
                                  )} %`
                                : '0 %'}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </>

                {/* 申請單位% */}
                <>
                  <div className="stateTit">申請單位</div>
                  <table className="countContainer">
                    <thead>
                      <tr>
                        <th></th>
                        {allUnit.map((v, i) => {
                          return <th key={uuidv4()}>{v.name}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {/* 件數 */}
                      <tr>
                        <th>案件量</th>
                        {allUnit.map((v, i) => {
                          let arr = unitTtl.filter(
                            (val) => Object.keys(val)[0] === v.name
                          );
                          return (
                            <td key={uuidv4()}>
                              {arr[0] !== undefined
                                ? `${arr[0][Object.keys(arr[0])]} 件`
                                : '0 件'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* %% */}
                      <tr>
                        <th>案件%</th>
                        {allUnit.map((v, i) => {
                          let arr = unitTtl.filter(
                            (val) => Object.keys(val)[0] === v.name
                          );
                          return (
                            <td key={i}>
                              {arr[0] !== undefined
                                ? `${percent(
                                    total,
                                    arr[0][Object.keys(arr[0])]
                                  )} %`
                                : '0 %'}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </>

                {/* 處理人% */}
                <>
                  <div className="stateTit">處理人</div>
                  <table className="countContainer">
                    <thead>
                      <tr>
                        <th></th>
                        <th>尚無處理人</th>
                        {allHandlerData.map((v, i) => {
                          return <th key={uuidv4()}>{v.name}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {/* 件數 */}
                      <tr>
                        <th>案件量</th>

                        <td>
                          {handleNull !== '' ? `${handleNull} 件` : '0 件'}
                        </td>

                        {allHandlerData.map((v, i) => {
                          let arr = handlerTtl.filter(
                            (val) => Object.keys(val)[0] === v.name
                          );
                          return (
                            <td key={i}>
                              {arr[0] !== undefined
                                ? `${arr[0][Object.keys(arr[0])]} 件`
                                : '0 件'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* %% */}
                      <tr>
                        <th>案件%</th>
                        <td>
                          {handleNull !== ''
                            ? `${percent(total, handleNull)} %`
                            : '0 %'}
                        </td>
                        {allHandlerData.map((v, i) => {
                          let arr = handlerTtl.filter(
                            (val) => Object.keys(val)[0] === v.name
                          );
                          return (
                            <td key={i}>
                              {arr[0] !== undefined
                                ? `${percent(
                                    total,
                                    arr[0][Object.keys(arr[0])]
                                  )} %`
                                : '0 %'}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </>

                {/* 申請人% */}
                <>
                  <div className="stateTit">申請人</div>
                  <table className="countContainer">
                    <thead>
                      <tr>
                        <th></th>
                        {userData.map((v, i) => {
                          return <th key={i}>{v.name}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {/* 件數 */}
                      <tr>
                        <th>案件量</th>
                        {userData.map((v, i) => {
                          let arr = userTtl.filter(
                            (val) => Object.keys(val)[0] === v.name
                          );
                          return (
                            <td key={i}>
                              {arr[0] !== undefined
                                ? `${arr[0][Object.keys(arr[0])]} 件`
                                : '0 件'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* %% */}
                      <tr>
                        <th>案件%</th>
                        {userData.map((v, i) => {
                          let arr = userTtl.filter(
                            (val) => Object.keys(val)[0] === v.name
                          );
                          return (
                            <td key={i}>
                              {arr[0] !== undefined
                                ? `${percent(
                                    total,
                                    arr[0][Object.keys(arr[0])]
                                  )} %`
                                : '0 %'}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </>

                {/* 申請狀態% */}
                <>
                  <div className="stateTit">案件狀態</div>
                  <table className="countContainer">
                    <thead>
                      <tr>
                        <th></th>
                        {countStatusData.map((v) => {
                          return <th key={uuidv4()}>{v.name}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {/* 件數 */}
                      <tr>
                        <th>案件量</th>
                        {countStatusData.map((v, i) => {
                          let arr = stateTtl.filter(
                            (val) => parseInt(Object.keys(val)[0]) === v.id
                          );
                          return (
                            <td key={i}>
                              {arr[0] !== undefined
                                ? `${arr[0][Object.keys(arr[0])]} 件`
                                : '0 件'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* %% */}
                      <tr>
                        <th>案件%</th>
                        {countStatusData.map((v, i) => {
                          let arr = stateTtl.filter(
                            (val) => parseInt(Object.keys(val)[0]) === v.id
                          );
                          return (
                            <td key={i}>
                              {arr[0] !== undefined
                                ? `${percent(
                                    total,
                                    arr[0][Object.keys(arr[0])]
                                  )} %`
                                : '0 %'}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </>
              </>
            ) : (
              ''
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default CountPage;
