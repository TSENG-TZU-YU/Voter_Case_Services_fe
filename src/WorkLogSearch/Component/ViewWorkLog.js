import React from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';
import '../_index.scss';

function ViewWorkLog({ setViewForm, viewData }) {
  return (
    <div className="viewWorkLogContain">
      <div className="addWorkLog">
        <AiFillCloseSquare
          className="closeBtn"
          onClick={() => {
            setViewForm(false);
          }}
        />
        <div className="title">工作日誌</div>

        {/* 表單內容 */}
        <div className="viewContain">
          {viewData.map((v, i) => {
            const { job_category, Job_description, create_time } = v;
            return (
              <div className="viewWorkLogFormContainer" key={i}>
                <div className="box">
                  <div className="gap">
                    <div className="contents18">填寫日期：</div>
                    <input type="text" value={create_time} disabled />
                  </div>
                </div>
                <div className="box">
                  <div className="gap">
                    <div className="contents18">工作類別：</div>
                    <input
                      className="handler contents18"
                      type="text"
                      value={job_category}
                      disabled
                    />
                  </div>
                </div>
                <div className="needs">
                  <div className="need">
                    <div className="one">
                      <div className="contents18">工作說明：</div>
                    </div>

                    <textarea
                      className="directions contents18 "
                      //   cols="100"
                      rows="10"
                      style={{ resize: 'none', height: '120px' }}
                      value={Job_description}
                      disabled
                    ></textarea>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ViewWorkLog;
