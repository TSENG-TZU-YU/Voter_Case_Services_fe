import React from 'react';
import '../styles/btn/_applicationBtn.scss';
function ApplicationBtn({ handleFn1, handleFn2, tit, accTit, rejTit = '' }) {
  return (
    <div className="checkBtnContent">
      <div>{tit}</div>
      <div className="check">
        <div className="editBtnAcc" onClick={handleFn1}>
          {accTit}
        </div>
        {rejTit ? (
          <div className="editBtnRej" onClick={handleFn2}>
            {rejTit}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default ApplicationBtn;
