import React, { useEffect, useState } from 'react';
import './_index.scss';

import CategoryFilter from './Component/CategoryFilter.js';
import PermissionFilter from './Component/PermissionFilter.js';
import UserFilter from './Component/UserFilter.js';
import axios from 'axios';

function Permissions() {
  const [user, setUser] = useState([]);
  const [nowUser, setNowUser] = useState([]);
  const [category, setCategory] = useState([]);
  const [nowCategory, setNowCategory] = useState([]);
  const [nowPermission, setNowPermission] = useState([]);
  const [permission, setPermission] = useState([
    { applicant_unit: '國會', name: '曾子瑜', permissions: '處理者' },
    { applicant_unit: '國會', name: '曾子瑜', permissions: '主管' },
    { applicant_unit: '服務處A', name: 'Kelly', permissions: '處理者' },
    { applicant_unit: '服務處B', name: '林鈺珊', permissions: '主管' },
  ]);

  useEffect(() => {
    async function getCategory() {
      try {
        let res = await axios.get(
          ' http://localhost:3001/api/permissions/category'
        );

        setCategory(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    async function getUsers() {
      try {
        let res = await axios.get('http://localhost:3001/api/permissions/user');

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    async function getPermissions() {
      try {
        let res = await axios.get(
          'http://localhost:3001/api/permissions/allPermissionsData'
        );

        setPermission(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    getCategory();
    getUsers();
    // getPermissions();
  }, []);

  const submit = async () => {
    try {
      let res = await axios.patch('http://localhost:3001/api/permissions', {
        category: nowCategory,
        user: nowUser,
        permission: nowPermission,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    // <div className="background ">
    //   <div className="permissions">
    //     <div className="container">
    //       <div className="select"> 單位:</div>
    //       <CategoryFilter category={category} setNowCategory={setNowCategory} />
    //     </div>
    //     <div className="container">
    //       <div className="select"> 使用者:</div>
    //       <UserFilter user={user} setNowUser={setNowUser} />
    //     </div>
    //     <div className="container">
    //       <div className="select"> 權限:</div>
    //       <PermissionFilter setNowPermission={setNowPermission} />
    //     </div>

    //     <div className="btn" onClick={submit}>
    //       加入權限
    //     </div>
    //   </div>
    //   <div className="container1">
    //     <div className="row mt">
    //       <div className="col-2 ">單位</div>
    //       <div className="col-3">使用者</div>
    //       <div className="col-5">權限</div>
    //     </div>
    //     <div className="vector"></div>
    //     {permission.map((v, i) => {
    //       const { applicant_unit, name, director, handler } = v;

    //       return (
    //         <div key={i} className="row mt">
    //           <div className="col-2">{applicant_unit}</div>
    //           <div className="col-3">{name}</div>
    //           <div className="col-4 row getPermissions">
    //             <div className="col-2">{director}</div>
    //             <div className="col-2">{handler}</div>
    //           </div>
    //           <div className="col-2 btn">更改權限</div>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
    <div className="permissionsContainer">
      {/* 篩選 */}
      <div className="sortSelect">
        <div className="bothFilter">
          <CategoryFilter category={category} setNowCategory={setNowCategory} />
          <UserFilter user={user} setNowUser={setNowUser} />
        </div>
        <PermissionFilter setNowPermission={setNowPermission} />
      </div>

      <table className="caseContain">
        <thead>
          <tr>
            <th>單位</th>
            <th>使用者</th>
            <th>權限</th>
          </tr>
        </thead>

        {permission.map((v, i) => {
          const { applicant_unit, name, permissions, director, handler } = v;
          return (
            <tbody key={i}>
              <tr>
                <td>{applicant_unit}</td>
                <td>{name}</td>
                <td>{permissions}</td>
                <td>
                  <span className="viewList"> 刪除權限</span>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

export default Permissions;
