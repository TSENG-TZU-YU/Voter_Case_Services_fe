import React, { useEffect, useState } from 'react';
import './_index.scss';

// import CategoryFilter from './Component/CategoryFilter.js';
// import PermissionFilter from './Component/PermissionFilter.js';
// import UserFilter from './Component/UserFilter.js';
import axios from 'axios';

function Audit() {
  const [user, setUser] = useState([]);
  const [nowUser, setNowUser] = useState([]);
  const [category, setCategory] = useState([]);
  const [nowCategory, setNowCategory] = useState([]);
  const [nowPermission, setNowPermission] = useState([]);
  const [audit, setAudit] = useState([]);

  // const [permission, setPermission] = useState([
  //   { applicant_unit: '國會', name: '曾子瑜', permissions: '處理者' },
  //   { applicant_unit: '國會', name: '曾子瑜', permissions: '主管' },
  //   { applicant_unit: '服務處A', name: 'Kelly', permissions: '處理者' },
  //   { applicant_unit: '服務處B', name: '林鈺珊', permissions: '主管' },
  // ]);

  useEffect(() => {
    async function getCategory() {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/permissions/category`
        );

        setCategory(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    async function getUsers() {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/permissions/user`
        );

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    async function getPermissions() {
      try {
        let res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/permissions/allPermissionsData`
        );

        // setPermission(res.data);
      } catch (err) {
        console.log(err);
      }
    }
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
    getCategory();
    getUsers();
    // getPermissions();
    audit();
  }, []);

  const submit = async () => {
    try {
      let res = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/permissions`,
        {
          category: nowCategory,
          user: nowUser,
          permission: nowPermission,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

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
