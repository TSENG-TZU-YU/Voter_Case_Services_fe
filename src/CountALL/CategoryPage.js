import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { API_URL } from '../utils/config';
import axios from 'axios';
import { useAuth } from '../utils/use_auth';
import moment from 'moment';

// import '../styles/caseManagement/_caseManagement.scss';
import '../styles/count/_countPage.scss';
import DateFilter from './Component/DateFilter.js';
import Loader from '../Loader';

// function CountPage({ setCaseNum, setCaseId, setHandlerNull, setSender }) {
function CategoryPage() {
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
  const [handleChange, setHandleChange] = useState(false);

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
  const [allStatusData, setAllStatusData] = useState([]);
  const [countStatusData, setCountStatusData] = useState([]);
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [allHandlerData, setAllHandlerData] = useState([]);
  const [handlerData, setHandlerData] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [userData, setuserData] = useState([]);

  // get total
  const [allTotal, setAllTotal] = useState('');
  const [total, setTotal] = useState('');
  const [stateTtl, setStateTtl] = useState([]);
  const [categoryTtl, setCategoryTtl] = useState([]);
  const [unitTtl, setUnitTtl] = useState([]);
  const [unitAppTtl, setUnitAppTtl] = useState([]);
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
        `${API_URL}/applicationData/getAssistantAllApp?category=${nowCategory}&state=${nowStatus}&unit=${nowUnit}&minDate=${minDate}&maxDate=${maxDate}&handler=${handler}&user=${nowUser}&userUnit=${nowUserUnit}&handlerUnit=${nowHandlerUnit}&appUnit=${nowAppUnit}`,
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
      setHandlerData(response.data.selHandlerResult);

      // total
      setAllTotal(response.data.pagination.allTotal);
      setTotal(response.data.pagination.total);
      setStateTtl(response.data.pagination.counts);
      setCategoryTtl(response.data.pagination.categoryCounts);
      setUnitTtl(response.data.pagination.unitCounts);
      setUnitAppTtl(response.data.pagination.unitAppCounts);
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
    nowHandlerUnit,
    nowAppUnit,
  ]);

  // %
  const percent = (ttl, num) => {
    let p = Math.round((parseInt(num) / parseInt(ttl)) * 10000) / 100;
    return p;
  };

  return (
    <>
      <div className="caseContainer">
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
              <div className="allTit">總申請案件 ： {allTotal} 件</div>
              <div className="allTit">搜尋件數 ： {total} 件</div>
            </div>

            <>
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
            </>
          </div>
        )}
      </div>
    </>
  );
}

export default CategoryPage;
