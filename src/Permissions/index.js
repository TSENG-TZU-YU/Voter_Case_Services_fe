import React from 'react';
import './index.scss';
function Permissions() {
  return (
    <div className="background ">
      <div className="permissions">
        <div>
          <div className="select"> 單位:</div>
          <select>
            <option> 單位a </option>
          </select>
        </div>
        <div>
          <div className="select"> 使用者:</div>
          <select>
            <option> 曾子瑜 </option>
          </select>
        </div>
        <div>
          <div className="select"> 權限:</div>
          <select>
            <option> 處理者 </option>
          </select>
        </div>

        <div className="btn">加入權限</div>
      </div>
      <div className="container">
        <div className="row mt">
          <div className="col-2 ">單位</div>
          <div className="col-3">使用者</div>
          <div className="col-5">權限</div>
        </div>
        <div className="vector"></div>
        <div className="row mt">
          <div className="col-2">單位</div>
          <div className="col-3">使用者</div>
          <div className="col-5 row getPermissions">
            <div className="col-2">權限</div>
            <div className="col-2">權限</div>
          </div>
          <div className="col-2">更改權限</div>
        </div>
      </div>
    </div>
  );
}

export default Permissions;
