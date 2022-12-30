import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaTelegramPlane } from 'react-icons/fa';
import { AiFillCloseSquare } from 'react-icons/ai';

import '../../styles/caseManagement/_checkStatePage.scss';
export default function CheckStatePage({
  setCheckState,
  handleStData,
  handlePostStatus,
  submitMsgTrue,
  setSubmitMsgTrue,
  setSubmitMessage,
  member,
  handlerNull,
}) {
  // console.log('h', handlerNull);
  // console.log('m', member.name);

  return (
    <div className="checkStateContainer">
      <div className="checkStateContain">
        <AiFillCloseSquare
          className="close"
          onClick={() => {
            setCheckState(false);
          }}
        />
        <div className="title">案件處理情形</div>

        {/* msg */}
        <div
          className={`handleStatus ${
            member.permissions_id === 3 ||
            (handlerNull === member.name && member.manage === 1)
              ? ''
              : 'noneHight'
          }`}
        >
          {handleStData.length !== 0
            ? handleStData.map((v) => {
                return (
                  <div className="msgContainer" key={uuidv4()}>
                    <div className="handler">處理人：{v.name}</div>
                    <div className="msgContain">{v.content}</div>
                    <div className="time">{v.create_time}</div>
                  </div>
                );
              })
            : '目前沒有訊息'}
        </div>

        {/* bar */}
        {member.permissions_id === 3 ||
        (handlerNull === member.name && member.manage === 1) ? (
          <div className="chatBarContain">
            <textarea
              className="submitMsg"
              placeholder="請輸入訊息..."
              name="ttt"
              // cols="100"
              rows="3"
              onChange={(e) => {
                let msg = e.target.value;
                setSubmitMessage(msg);
                // console.log(msg);
                if (msg !== '') {
                  setSubmitMsgTrue(true);
                } else {
                  setSubmitMsgTrue(false);
                }
              }}
            ></textarea>
            <FaTelegramPlane
              className={`submitIcon ${submitMsgTrue ? 'submitTrue' : ''}`}
              onClick={(e) => {
                handlePostStatus(e);
              }}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
