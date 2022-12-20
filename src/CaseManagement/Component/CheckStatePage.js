import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import '../../styles/caseManagement/_checkStatePage.scss';
export default function CheckStatePage({ setCheckState, caseHistory }) {
  return (
    <div className="checkStateContainer">
      <div
        className="close"
        onClick={() => {
          setCheckState(false);
        }}
      >
        關閉
      </div>
      <div className="checkStateContain">
        <div className="title">申請狀態列表</div>
        <table className="checkStateTable">
          <thead>
            <tr>
              <th>案件編號</th>
              <th>處理人</th>
              <th>處理狀態</th>
              <th>處理時間</th>
            </tr>
          </thead>
          {caseHistory.map((v) => {
            return (
              <tbody key={uuidv4()}>
                <tr>
                  <td>{v.case_number}</td>
                  <td>{v.handler}</td>
                  <td>{v.select_state}</td>
                  <td>{v.create_time}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}
