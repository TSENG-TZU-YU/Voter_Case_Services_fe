import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../../styles/caseDetail/_editNeedPage.scss';
import { MdOutlineAddBox } from 'react-icons/md';
import { AiFillCloseCircle, AiFillCloseSquare } from 'react-icons/ai';

function EditNeedPage({
  setEditPage,
  handleAddNeed,
  editNeed,
  handleDelNeed,
  handlerUpdateNeed,
  hanleAddNeed,
  editVerifyPage,
  delCheck,
}) {
  console.log(editNeed);
  return (
    <div className="editNeedContainer">
      <div className="editNeedContain">
        <AiFillCloseSquare
          className="closeBtn"
          onClick={() => {
            setEditPage(false);
          }}
        />
        <div className="title">申請需求修改</div>
        <div className="editNeedWidth">
          {/* 需求表單 */}
          <div className="addTitle">
            <div>增加需求</div>
            <MdOutlineAddBox
              className="addNeedIcon"
              onClick={() => {
                handleAddNeed();
              }}
            />
          </div>

          {/* 需求內容 */}
          {editNeed.map((v, i) => {
            return (
              <div className="addNeedTable" key={i}>
                <div>
                  <span className="needTit">需求 {1 + i} (字數限制500字)</span>
                  {i !== 0 ? (
                    <AiFillCloseCircle
                      className="delNeedIcon"
                      onClick={() => {
                        delCheck('確定要刪除此需求內容?', handleDelNeed, i);
                      }}
                    />
                  ) : (
                    ''
                  )}
                </div>
                {/* <div className="needInput center">
                  <span className="pe-1">1.</span>
                  <input
                    type="text"
                    name="tit"
                    placeholder="請輸入標題"
                    value={editNeed[i].requirement_name}
                    onChange={(e) => {
                      handlerUpdateNeed(e.target.value, i, 'tit');
                    }}
                  />
                </div> */}
                <div className="needInput">
                  {/* <span className="pe-1">2.</span> */}
                  <textarea
                    name="dir"
                    rows="3"
                    maxLength="500"
                    placeholder="請依據標題詳細說明"
                    value={editNeed[i].directions}
                    onChange={(e) => {
                      handlerUpdateNeed(e.target.value, i, 'dir');
                    }}
                  ></textarea>
                </div>
              </div>
            );
          })}
        </div>
        <div className="submitBtn">
          <button
            className="finishBtn"
            onClick={(e) => {
              hanleAddNeed(e, 'finish');
            }}
          >
            修改完成
          </button>
          {editVerifyPage ? (
            <div className="editVerify">*欄位不得為空</div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}

export default EditNeedPage;
