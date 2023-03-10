import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import moment from 'moment';
import axios from 'axios';
import './_index.scss';
import MonthFilter from './Component/MonthFilter';
import { GiCheckMark } from 'react-icons/gi';
import ViewWorkLog from './Component/ViewWorkLog';
import UnitFilter from './Component/UnitFilter';
import Loader from '../Loader';

function WorkLogSearch() {
  const location = useLocation();
  // 從網址上抓到關鍵字
  let params = new URLSearchParams(location.search);
  let Unit = params.get('unit');

  const [workLog, setWorkLog] = useState([]);
  const [users, setUsers] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [viewForm, setViewForm] = useState(false);
  const [allUnit, setAllUnit] = useState([]);
  const [nowUnit, setNowUnit] = useState(Unit);
  const [isLoading, setIsLoading] = useState(false);

  //date
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

  // 最大及最小日期初值
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth());

  let month = sixMonthsAgo.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  const maxM = `${sixMonthsAgo.getFullYear()}/${month}/31`;
  const minM = `${sixMonthsAgo.getFullYear()}/${month}/01`;

  const [maxDate, setMaxDate] = useState(maxM);
  const [minDate, setMinDate] = useState(minM);

  useEffect(() => {
    async function audit() {
      setIsLoading(true);
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/workLog?unit=${nowUnit}`,
          {
            withCredentials: true,
          }
        );

        setWorkLog(res.data.result);
        setUsers(res.data.user);
        setAllUnit(res.data.unitResult);
        setTimeout(() => {
          setIsLoading(false);
        });
      } catch (err) {
        console.log(err);
      }
    }
    audit();
  }, [nowUnit]);

  // 查看詳細日誌內容
  let handleView = async (code, time) => {
    try {
      let res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/workLog/viewWorkLog`,
        { code, time },
        {
          withCredentials: true,
        }
      );
      setViewData(res.data);
    } catch (err) {
      console.log(err);
    }

    // console.log('r',response.data.result)
  };

  const start_date = new Date(minDate);
  const end_date = new Date(maxDate >= nowDate ? nowDate : maxDate);
  const allDate = [];
  for (let d = start_date; d <= end_date; d.setDate(d.getDate() + 1)) {
    let newD = d.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    if (newD.slice(5, 7) === minDate.slice(5, 7)) allDate.push(newD);
  }
  return (
    <div className="workLogSearchContainer">
      {viewForm ? (
        <ViewWorkLog setViewForm={setViewForm} viewData={viewData} />
      ) : (
        ''
      )}
      {/* 篩選 */}
      <div className="sortSctBetween">
        <div className="sortSct">
          <div className="monthSelect">
            <div className="month">
              <div>請選擇年月份：</div>
              <MonthFilter setMaxDate={setMaxDate} setMinDate={setMinDate} />
            </div>
            <div className="month ms-2">
              <div>請選擇單位：</div>
              <UnitFilter
                allUnit={allUnit}
                setNowUnit={setNowUnit}
                Unit={Unit}
              />
            </div>
          </div>

          <div className="squareContainer">
            <div className="squareContain">
              <div className="squareB"></div>
              <div>：已填寫</div>
            </div>
            <div className="squareContain">
              <div className="squareP"></div>
              <div>：未填寫</div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="workContainer">
          <Loader />
        </div>
      ) : (
        <div className="workContainer">
          <table className="workContain">
            <thead>
              <tr>
                {users.length !== 0 ? <th>使用者</th> : ''}

                {allDate.map((v, i) => {
                  return <th key={i}>{v}</th>;
                })}
              </tr>
            </thead>

            <tbody>
              {users.length !== 0 ? (
                users.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        {v.name} {v.staff_code}
                      </td>

                      {allDate.map((d, i) => {
                        let arr = workLog.filter(
                          (val) =>
                            val.time === d &&
                            parseInt(val.staff_code) === parseInt(v.staff_code)
                        );
                        return (
                          <td key={i}>
                            {arr.length !== 0 &&
                            arr[0].Job_description !== '' ? (
                              <div
                                className="write"
                                onClick={() => {
                                  handleView(v.staff_code, arr[0].time);
                                  setViewForm(true);
                                }}
                              >
                                <GiCheckMark size="20" className="check" />
                              </div>
                            ) : (
                              <div className="noWrite"></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={32} className="noData">
                    目前沒有資料
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WorkLogSearch;
