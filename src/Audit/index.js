import React, { useEffect, useState } from 'react';
import './_index.scss';

import UserFilter from './Component/UserFilter.js';
import axios from 'axios';
import { clearConfigCache } from 'prettier';

function Audit() {
  const [audit, setAudit] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
  useEffect(() => {
    async function audit() {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/audit?search=${nameSearch}`
        );

        setAudit(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    audit();
  }, []);
  console.log('c', nameSearch);

  return (
    <div className="permissionsContainer">
      {/* 篩選 */}
      <div className="sortSelect1">
        <div className="bothFilter1">
          <input
            type="text"
            placeholder="請輸入使用者員工編號或案件編號"
            maxLength={15}
            value={nameSearch}
            onChange={(e) => {
              let textValue = e.target.value;
              console.log('v', textValue);
              setNameSearch(textValue);
            }}
          />
          {/* <UserFilter user={user} setNowUser={setNowUser} /> */}
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

export default Audit;
