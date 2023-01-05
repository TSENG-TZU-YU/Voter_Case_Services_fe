import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/config';
import axios from 'axios';
import { useAuth } from '../utils/use_auth';
import moment from 'moment';

// import '../styles/caseManagement/_caseManagement.scss';

import DateFilter from './Component/DateFilter.js';
import Loader from '../Loader';
function UnitPage({ setCaseNum, setCaseId, setHandlerNull, setSender }) {
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
  const [number, setNumber] = useState(true);
  const [time, setTime] = useState(true);
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
  const [allData, setAllData] = useState([]);
  const [caseHistory, setCaseHistory] = useState([]);
  const [allUnit, setAllUnitData] = useState([]);

  // get total
  const [allTotal, setAllTotal] = useState('');
  const [total, setTotal] = useState('');
  const [stateTtl, setStateTtl] = useState([]);
  const [categoryTtl, setCategoryTtl] = useState([]);
  const [unitTtl, setUnitTtl] = useState([]);
  const [handlerTtl, setHandlerTtl] = useState([]);

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
      //   console.log(response.data.pagination.total);
      setAllData(response.data.result);
      setAllUnitData(response.data.unitResult);
      // total
      setAllTotal(response.data.pagination.allTotal);
      setTotal(response.data.pagination.total);
      setUnitTtl(response.data.pagination.unitCounts);
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

  // 審查 history
  let handleCaseHistory = async (caseNum) => {
    let response = await axios.get(
      `${API_URL}/applicationData/getCaseHistory/${caseNum}`,
      {
        withCredentials: true,
      }
    );
    setCaseHistory(response.data.result);
  };

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

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="caseContainer">
          {/* 篩選 */}
          <div className="sortSelect"></div>
          <div className="userFlex">
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
                {/* 申請單位% */}
                {nowUnit ? (
                  ''
                ) : (
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
                )}
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default UnitPage;
