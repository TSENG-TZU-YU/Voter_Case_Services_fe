import React, { useEffect, useState } from 'react';
import './_index.scss';
import moment from 'moment';
import Loader from '../Loader';

import DateFilter from './Component/DateFilter.js';
import axios from 'axios';
import { clearConfigCache } from 'prettier';

function Audit() {
  const [audit, setAudit] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
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

  let dateAgo = newDateString.replace(/\//g, '-');
  const [dateRemind, setDateRemind] = useState('');
  const [maxDateValue, setMaxDateValue] = useState(nowDate);
  const [minDateValue, setMinDateValue] = useState(nowDate);
  const [maxDate, setMaxDate] = useState(nowDate);
  const [minDate, setMinDate] = useState(nowDate);

  useEffect(() => {
    async function audit() {
      setIsLoading(true);
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/audit?minDate=${minDate}&maxDate=${maxDate}&search=${nameSearch}`
        );

        setAudit(res.data);
        setTimeout(() => {
          setIsLoading(false);
        });
      } catch (err) {
        console.log(err);
      }
    }
    audit();
  }, [minDate, maxDate, nameSearch]);

  return (
    <div className="auditContainer">
      {/* 篩選 */}
      <div className="sortSelect1">
        <div className="bothFilter1">
          <input
            type="text"
            className="searchInput"
            placeholder="請輸入使用者員工編號或案件編號"
            maxLength={15}
            value={nameSearch}
            onChange={(e) => {
              let textValue = e.target.value;
              setNameSearch(textValue);
            }}
          />
          <DateFilter
            dateRemind={dateRemind}
            setDateRemind={setDateRemind}
            setMaxDate={setMaxDate}
            setMinDate={setMinDate}
            maxDateValue={maxDateValue}
            setMaxDateValue={setMaxDateValue}
            minDateValue={minDateValue}
            setMinDateValue={setMinDateValue}
            // dateAgo={dateAgo}
            nowDate={nowDate}
          />
        </div>
      </div>

      <table className="caseContain">
        <thead>
          <tr>
            <th>使用者</th>
            <th>紀錄</th>
            <th>時間</th>
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
            {audit.length !== 0 ? (
              <>
                {audit.map((v, i) => {
                  const { user, record, time } = v;
                  return (
                    <tbody key={i}>
                      <tr>
                        <td>{user}</td>
                        <td>{record}</td>
                        <td>{time}</td>
                      </tr>
                    </tbody>
                  );
                })}
              </>
            ) : (
              <tbody className="noData">
                <tr>
                  <td colSpan={3} className="noTd">
                    目前沒有資料
                  </td>
                </tr>
              </tbody>
            )}
          </>
        )}
      </table>
    </div>
  );
}

export default Audit;
