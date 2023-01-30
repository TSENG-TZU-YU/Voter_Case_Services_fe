import React, { useEffect, useState } from 'react';
import './_index.scss';

// import CategoryFilter from './Component/CategoryFilter.js';
// import PermissionFilter from './Component/PermissionFilter.js';
// import UserFilter from './Component/UserFilter.js';
import axios from 'axios';

function Audit() {
  const [audit, setAudit] = useState([]);

  useEffect(() => {
    async function audit() {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/audit`
        );

        setAudit(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    audit();
  }, []);

  return (
    <div className="permissionsContainer">
      {/* 篩選 */}
      <div className="sortSelect1">
        {/* <div className="bothFilter1">
          <CategoryFilter category={category} setNowCategory={setNowCategory} />
          <UserFilter user={user} setNowUser={setNowUser} />
          <PermissionFilter setNowPermission={setNowPermission} />
        </div> */}
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
