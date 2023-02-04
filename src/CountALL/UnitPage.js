import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { API_URL } from '../utils/config';
import axios from 'axios';
import { useAuth } from '../utils/use_auth';
import moment from 'moment';

// import '../styles/caseManagement/_caseManagement.scss';
import '../styles/count/_countPage.scss';
import DateFilter from './Component/DateFilter.js';
import SimplePieChart from './Component/SimplePieChart';
import SimpleBarChart from './Component/SimpleBarChart';

import Loader from '../Loader';

// function CountPage({ setCaseNum, setCaseId, setHandlerNull, setSender }) {
function UnitPage() {
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

  const [isLoading, setIsLoading] = useState(false);

  // 篩選
  const [nowStatus, setNowStatus] = useState('');
  const [nowCategory, setNowCategory] = useState('');
  const [nowUnit, setNowUnit] = useState('');
  const [nowAppUnit, setNowAppUnit] = useState('');
  const [maxDate, setMaxDate] = useState(nowDate);
  const [minDate, setMinDate] = useState(dateAgo);
  // const [finish, setFinish] = useState('');
  const [handler, setHandler] = useState('');
  const [nowUser, setNowUser] = useState('');
  const [nowUserUnit, setNowUserUnit] = useState('');
  const [nowHandlerUnit, setNowHandlerUnit] = useState('');

  // get data
  const [allUnit, setAllUnitData] = useState([]);
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [userData, setuserData] = useState([]);

  // get total
  const [allTotal, setAllTotal] = useState('');
  const [total, setTotal] = useState('');
  const [unitTtl, setUnitTtl] = useState([]);
  const [unitAppTtl, setUnitAppTtl] = useState([]);

  //bar chart
  const [chart, setChart] = useState([]);

  // 取得所有資料
  useEffect(() => {
    setIsLoading(true);
    let getAllData = async () => {
      let response = await axios.get(
        `${API_URL}/applicationData/getAssistantAllApp?category=${nowCategory}&state=${nowStatus}&unit=${nowUnit}&minDate=${minDate}&maxDate=${maxDate}&handler=${handler}&user=${nowUser}&userUnit=${nowUserUnit}&handlerUnit=${nowHandlerUnit}&appUnit=${nowAppUnit}`,
        {
          withCredentials: true,
        }
      );
      setAllUnitData(response.data.unitResult);
      setAllUserData(response.data.userResult);
      setuserData(response.data.AllUserResult);

      // total
      setAllTotal(response.data.pagination.allTotal);
      setTotal(response.data.pagination.total);
      setUnitTtl(response.data.pagination.unitCounts);
      setUnitAppTtl(response.data.pagination.unitAppCounts);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    };

    let getBar = async () => {
      try {
        let response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/chart/appUnitPage?&minDate=${minDate}&maxDate=${maxDate}`,
          {
            withCredentials: true,
          }
        );
        setChart(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getBar();
    getAllData();
  }, [nowUnit, minDate, maxDate, handler, nowUser, nowUserUnit, nowAppUnit]);

  // %
  const percent = (ttl, num) => {
    let p = Math.round((parseInt(num) / parseInt(ttl)) * 10000) / 100;
    return p;
  };

  return (
    <>
      <div className="caseWrap">
        {/* 篩選 */}
        <div className="sortSelect">
          {/* 日期 */}
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
              {/* <div className="allTit">總申請案件 ： {allTotal} 件</div> */}
              <div className="allTit">
                篩選結果件數 ： {total} 件 / {allTotal} 件
              </div>
            </div>

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
                      let arr = unitAppTtl.filter(
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
                            ? `${percent(total, arr[0][Object.keys(arr[0])])} %`
                            : '0 %'}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
              <SimpleBarChart chart={chart} />
            </>
          </div>
        )}
      </div>
    </>
  );
}

export default UnitPage;
