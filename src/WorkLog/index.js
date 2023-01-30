import React, { useEffect, useState } from 'react';
import './_index.scss';
import moment from 'moment';

import axios from 'axios';

function WorkLog() {
  const [audit, setAudit] = useState([]);

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
  const [minDateValue, setMinDateValue] = useState(dateAgo);
  const [maxDate, setMaxDate] = useState(nowDate);
  const [minDate, setMinDate] = useState(dateAgo);

  useEffect(() => {
    async function audit() {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/audit?minDate=${minDate}&maxDate=${maxDate}`
        );

        setAudit(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    audit();
  }, [minDate, maxDate]);

  return (
    <div className="permissionsContainer">
      {/* 篩選 */}
      <div className="sortSelect1"></div>

      <table className="caseContain">
        <thead>
          <tr>
            <th>使用者</th>
            <th>紀錄</th>
            <th>時間</th>
          </tr>
        </thead>

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
      </table>
    </div>
  );
}

export default WorkLog;
